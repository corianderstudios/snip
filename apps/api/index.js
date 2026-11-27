import express from "express";
import cors from "cors";
import { formatGreeting } from "@repo/shared";

const app = express();
app.use(cors());

app.get("/api/hello", (req, res) => {
  res.json({ message: formatGreeting("API") });
});

app.listen(3000, () => console.log("API running on http://localhost:3000"));
