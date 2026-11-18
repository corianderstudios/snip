import { db } from "./db.js";

let cachedId = null;

export async function getDevUserId() {
  if (cachedId) return cachedId;

  const { rows } = await db.query(
    `SELECT user_id FROM users WHERE username = 'guest'`,
  );

  if (rows.length === 0) {
    throw new Error("No guest user. Run: psql $DATABASE_URL -f seeds/dev.sql");
  }

  cachedId = rows[0].user_id;
  return cachedId;
}
