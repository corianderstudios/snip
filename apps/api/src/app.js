import express from "express";
import { requestLogger } from "./logger.js";
import { randomBytes } from "node:crypto";
import { LinkInput } from "@repo/shared";
import { validateBody } from "./validate.js";
import { db } from "./db.js";

function generateCode() {
  return randomBytes(6).toString("base64url");
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
    const userId = 1;

    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const { rows } = await db.query(
          `INSERT INTO links (link, short_code, user_id)
             VALUES ($1, $2, $3)
             RETURNING link_id, link, short_code, created_at`,
          [url, generateCode, userId],
        );

        const row = rows[0];
        return res.status(201).json({
          id: String(row.link_id),
          url: row.link,
          shortCode: row.short_code,
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
  app.delete("/api/links", (req, res) => {});

  app.get("/api/links", (req, res) => {});

  //   app.get("/api/db-check", async (req, res) => {
  //     const { rows } = await db.query("SELECT now() AS time");
  //     res.json({ time: rows[0].time });
  //   });

  app.use((err, req, res, next) => {
    console.error(JSON.stringify({ level: "error", msg: err.message }));
    res.status(500).json({ error: "Internal error" });
  });

  return app;
}
