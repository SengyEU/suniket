import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db.js";
import apiRoutes from "./routes/api.js";
import adminRoutes from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.use("/api", apiRoutes);
app.use("/api/admin", adminRoutes);

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get(/^\/admin(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin", "index.html"));
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Suniket API running on port ${PORT}`);
  });
});
