import { buildApp } from "./app.js";
import { config } from "./config.js";
import { db } from "./db.js";

const app = buildApp();

const server = app.listen(config.PORT, () => {
  console.log(
    JSON.stringify({ level: "info", msg: "listening", port: config.PORT }),
  );
});

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) return; // a second Ctrl+C shouldn't start this over
  shuttingDown = true;

  console.log(JSON.stringify({ level: "info", msg: "shutting down", signal }));

  // Hard ceiling. A graceful shutdown that never finishes is just a hang,
  // and the platform will SIGKILL us anyway — better to leave on our terms.
  const timer = setTimeout(() => {
    console.error(
      JSON.stringify({ level: "error", msg: "shutdown timed out" }),
    );
    process.exit(1);
  }, 10_000);
  timer.unref(); // this timer alone shouldn't keep the process alive

  // Stops accepting new connections, waits for in-flight requests, then calls back.
  server.close(async (err) => {
    clearTimeout(timer);
    if (err) {
      console.error(JSON.stringify({ level: "error", msg: "shutdown failed" }));
      process.exit(1);
    }
    // await pool.end() goes here once there's a database.
    await db.end();
    process.exit(0);
  });

  // Keep-alive sockets sit open with no request on them, and close() waits for
  // them. Without this line a browser tab can hold shutdown until the timeout.
  server.closeIdleConnections();
}

process.on("SIGTERM", () => shutdown("SIGTERM")); // containers and platforms
process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C
