import express from "express";
import { randomBytes } from "node:crypto";
import { LinkInput, IdParam } from "@repo/shared";
import { requestLogger } from "./logger.js";
import { validateBody, validateParams } from "./validate.js";
import { db } from "./db.js";
import { getDevUserId } from "./devUser.js";
import { config } from "./config.js";

function generateCode() {
  return randomBytes(6).toString("base64url");
}

function toLink(row) {
  return {
    id: String(row.link_id),
    url: row.link,
    shortCode: row.short_code,
    shortUrl: `${config.PUBLIC_BASE_URL}/${row.short_code}`,
    createdAt: row.created_at,
  };
}

export function buildApp() {
  const app = express();

  app.use(express.json({ limit: "100kb" }));
  app.use(requestLogger);

  app.get("/api/hello", (req, res) =>
    res.json({ ok: true, message: "Hey, hello" }),
  );

  app.get("/api/health", (req, res) =>
    res.json({ ok: true, message: "everything is healthy" }),
  );

  app.get("/api/slow", async (req, res) => {
    await new Promise((r) => setTimeout(r, 8000));
    res.json({ ok: true });
  });

  app.post("/api/links", validateBody(LinkInput), async (req, res) => {
    const { url } = req.body;
    const userId = await getDevUserId();

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const { rows } = await db.query(
          `INSERT INTO links (link, short_code, user_id)
             VALUES ($1, $2, $3)
             RETURNING link_id, link, short_code, created_at`,
          [url, generateCode(), userId],
        );

        const row = rows[0];
        return res.status(201).json({
          id: String(row.link_id),
          url: row.link,
          shortCode: row.short_code,
          shortUrl: `${config.PUBLIC_BASE_URL}/${row.short_code}`,
          createdAt: row.created_at,
        });
      } catch (error) {
        if (error.code !== "23505") throw error;
      }
    }

    res
      .status(503)
      .json({ error: "Could not allocate a short code, try again" });
  });
  app.delete(
    "/api/links/:linkId",
    validateParams(IdParam),
    async (req, res) => {
      const { linkId } = req.params;
      const userId = await getDevUserId();

      const { rowCount } = await db.query(
        `DELETE FROM links
          WHERE link_id=$1 AND user_id=$2`,
        [linkId, userId],
      );

      console.log("delete", { linkId, userId, rowCount });

      if (rowCount === 0) {
        return res.status(404).end();
      }

      res.status(204).end();
    },
  );

  app.get("/api/links", async (req, res) => {
    const userId = await getDevUserId();

    const { rows } = await db.query(
      `SELECT link_id, link, short_code, created_at
     FROM links
     WHERE user_id = $1
     ORDER BY created_at DESC`,
      [userId],
    );

    res.json(rows.map(toLink));
  });

  app.get("/:code", async (req, res) => {
    const { code } = req.params;
    const { rows } = await db.query(
      "SELECT link_id, link FROM links WHERE short_code = $1",
      [code],
    );

    if (rows.length === 0) return res.status(404).send("Link not found");

    res.redirect(302, rows[0].link);

    db.query("INSERT INTO clicks (link_id) VALUES ($1)", [
      rows[0].link_id,
    ]).catch((err) =>
      console.error(
        JSON.stringify({
          level: "error",
          msg: "click insert failed",
          detail: err.message,
        }),
      ),
    );

    res.status(201).json({
      id: String(row.link_id),
      url: row.link,
      shortCode: row.short_code,
      shortUrl: `${config.PUBLIC_BASE_URL}/${row.short_code}`,
      createdAt: row.created_at,
    });
  });

  app.use((err, req, res, next) => {
    console.error(JSON.stringify({ level: "error", msg: err.message }));
    res.status(500).json({ error: "Internal error" });
  });

  return app;
}
