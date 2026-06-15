import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "uploads", "photos");

async function main() {
  const db = await initDb();
  const rows = db.all("SELECT id, src, thumb FROM photos WHERE thumb IS NULL OR thumb = ''");
  if (!rows.length) { console.log("Všechny fotky už mají thumbnail."); return; }
  for (const row of rows) {
    const srcPath = path.join(uploadDir, path.basename(row.src));
    if (!fs.existsSync(srcPath)) { console.log(`  Přeskočeno (nenalezeno): ${srcPath}`); continue; }
    const thumbName = "thumb_" + path.basename(row.src);
    const thumbPath = path.join(uploadDir, thumbName);
    const meta = await sharp(srcPath).metadata();
    if (meta.width > 400) {
      await sharp(srcPath).resize(400).webp({ quality: 60 }).toFile(thumbPath);
    } else {
      await sharp(srcPath).webp({ quality: 60 }).toFile(thumbPath);
    }
    const thumb = "/uploads/photos/" + thumbName;
    db.run("UPDATE photos SET thumb = ? WHERE id = ?", [thumb, row.id]);
    console.log(`  OK #${row.id}: ${thumb}`);
  }
  console.log("Hotovo.");
}

main().catch(console.error);