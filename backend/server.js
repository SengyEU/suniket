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

const corsOrigin = process.env.CORS_ORIGIN?.split(",") || "*";
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", apiRoutes);
app.use("/api/admin", adminRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/admin", express.static(path.join(__dirname, "dist")));
app.get(/^\/admin(?:\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.use(express.static(path.join(__dirname, "public")));

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Suniket API running on port ${PORT}`);
  });
});
