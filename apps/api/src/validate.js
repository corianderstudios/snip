export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(422).json({
        error: "Invalid request body",
        issues: parsed.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }

    req.body = parsed.data; // replace the raw body with the cleaned version
    next();
  };
}
