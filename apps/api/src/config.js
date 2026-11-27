import { z } from "zod";

// Everything in process.env is a string, so PORT is coerced to a number.
const Env = z.object({
  DATABASE_URL: z.url(),
  PUBLIC_BASE_URL: z.url().default("http://localhost:3000"),
  PORT: z.coerce.number().int().positive().default(3000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsed = Env.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1); // non-zero tells the platform the start failed
}

export const config = Object.freeze(parsed.data);
