import { randomUUID } from "node:crypto";

export function requestLogger(req, res, next) {
  // hrtime is monotonic: unlike Date.now() it can't jump if the clock changes.
  const start = process.hrtime.bigint();

  req.id = randomUUID();
  res.setHeader("x-request-id", req.id); // lets a client quote it in a bug report

  // 'finish' fires once the response has been handed off, so by now we know
  // the status code and how long it took. Logging on the way in can't know either.
  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;

    console.log(
      JSON.stringify({
        level: "info",
        msg: "request",
        id: req.id,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        ms: Math.round(ms * 10) / 10,
      }),
    );
  });

  next(); // hand off immediately — the log happens later, on its own
}
