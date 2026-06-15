import { Router } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
import db from "../db.js";
import auth from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "uploads", "photos");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 }, fileFilter: (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) return cb(new Error("Only images allowed"));
  cb(null, true);
}});

const router = Router();

router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_API_KEY) {
    return res.json({ success: true, token: password });
  }
  return res.status(401).json({ error: "Invalid password" });
});

function isWebP(buf) {
  return buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50;
}

async function saveImage(buf, uploadDir) {
  const ext = ".webp";
  const name = crypto.randomUUID() + ext;
  const thumbName = "thumb_" + name;
  const outPath = path.join(uploadDir, name);
  const thumbPath = path.join(uploadDir, thumbName);
  const meta = await sharp(buf).metadata();
  const maxDim = 1920;
  const resizeOpts = meta.width > maxDim ? { width: maxDim } : {};
  if (isWebP(buf)) {
    await sharp(buf).resize(resizeOpts).webp({ quality: 50 }).toFile(outPath);
  } else {
    await sharp(buf).resize(resizeOpts).webp({ quality: 50 }).toFile(outPath);
  }
  if (meta.width > 400) {
    await sharp(buf).resize({ width: 400 }).webp({ quality: 60 }).toFile(thumbPath);
  } else {
    await sharp(buf).webp({ quality: 60 }).toFile(thumbPath);
  }
  return { src: "/uploads/photos/" + name, thumb: "/uploads/photos/" + thumbName };
}

router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const result = await saveImage(req.file.buffer, uploadDir);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/photos/upload-multiple", auth, upload.array("files", 50), async (req, res) => {
  try {
    if (!req.files || !req.files.length) return res.status(400).json({ error: "No files uploaded" });
    const results = [];
    for (const file of req.files) {
      const { src, thumb } = await saveImage(file.buffer, uploadDir);
      const row = db.one("SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM photos");
      const info = db.run("INSERT INTO photos (src, thumb, alt, sort_order) VALUES (?, ?, ?, ?)", [src, thumb, "", row.next]);
      results.push({ id: info.lastInsertRowid, src, thumb });
    }
    res.json({ success: true, count: results.length, photos: results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/sort-dir", auth, (req, res) => {
  const rows = db.all("SELECT * FROM settings WHERE key LIKE 'sort_dir_%'");
  const dirs = {};
  for (const r of rows) dirs[r.key.replace("sort_dir_", "")] = r.value;
  res.json(dirs);
});

router.post("/sort-dir", auth, (req, res) => {
  const { section, dir } = req.body;
  if (!section || !dir) return res.status(400).json({ error: "section and dir required" });
  db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [`sort_dir_${section}`, dir]);
  res.json({ success: true });
});

function crud(table, fields) {
  const r = Router();
  r.use(auth);

  r.get("/", (req, res) => {
    let sql = `SELECT * FROM ${table}`;
    const params = [];
    const q = Object.entries(req.query).filter(([k]) => fields.includes(k));
    if (q.length) {
      sql += " WHERE " + q.map(([k]) => `${k} = ?`).join(" AND ");
      q.forEach(([, v]) => params.push(v));
    }
    const dir = req.query.sort === "desc" ? "DESC" : "ASC";
    sql += ` ORDER BY sort_order ${dir}`;
    const rows = db.all(sql, params);
    res.json(rows);
  });

  r.post("/", (req, res) => {
    const f = {};
    for (const k of fields) {
      if (k === "sort_order" && req.body[k] === undefined) {
        const row = db.one(`SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM ${table}`);
        f[k] = row.next;
      } else {
        f[k] = req.body[k] ?? null;
      }
    }
    const cols = Object.keys(f).join(", ");
    const vals = Object.values(f);
    const ph = vals.map(() => "?").join(", ");
    const info = db.run(`INSERT INTO ${table} (${cols}) VALUES (${ph})`, vals);
    const row = db.one(`SELECT * FROM ${table} WHERE id = ?`, [info.lastInsertRowid]);
    res.status(201).json(row);
  });

  r.put("/:id", (req, res) => {
    const f = {};
    for (const k of fields) {
      if (req.body[k] !== undefined) f[k] = req.body[k];
    }
    const sets = Object.keys(f).map((k) => `${k} = ?`).join(", ");
    const vals = [...Object.values(f), req.params.id];
    db.run(`UPDATE ${table} SET ${sets} WHERE id = ?`, vals);
    const row = db.one(`SELECT * FROM ${table} WHERE id = ?`, [req.params.id]);
    res.json(row);
  });

  r.delete("/:id", (_req, res) => {
    db.run(`DELETE FROM ${table} WHERE id = ?`, [_req.params.id]);
    res.json({ success: true });
  });

  return r;
}

const timelineFields = ["year", "text", "img", "alt", "sort_order"];
const concertFields = ["is_upcoming", "date", "event", "link", "place", "time", "entry", "entry_has_link", "entry_price", "entry_link", "sort_order"];
const albumFields = ["title", "cover", "description", "link_text", "link", "sort_order"];
const songFields = ["album_id", "title", "sort_order"];
const lyricFields = ["song_id", "line", "line_order", "sort_order"];
const newsFields = ["date", "title", "description", "image", "link", "link_text", "sort_order"];
const photoFields = ["src", "thumb", "alt", "sort_order"];
const videoFields = ["youtube_id", "sort_order"];
const memberFields = ["name", "role", "photo", "description", "equipment", "sort_order"];

const contactKeys = ["contact_name", "contact_role", "contact_phone", "contact_email", "contact_email2", "contact_city",
  "download_1_name", "download_1_link", "download_2_name", "download_2_link", "download_3_name", "download_3_link"];

router.get("/contact-settings", auth, (req, res) => {
  const rows = db.all("SELECT * FROM settings WHERE key LIKE 'contact_%' OR key LIKE 'download_%'");
  const out = {};
  for (const k of contactKeys) out[k] = "";
  for (const r of rows) out[r.key] = r.value;
  res.json(out);
});

router.post("/contact-settings", auth, (req, res) => {
  for (const k of contactKeys) {
    if (req.body[k] !== undefined) {
      db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [k, req.body[k]]);
    }
  }
  res.json({ success: true });
});

router.use("/timeline", crud("timeline", timelineFields));
router.use("/concerts", crud("concerts", concertFields));
router.use("/albums", crud("albums", albumFields));
router.use("/songs", crud("songs", songFields));
router.use("/lyrics", crud("lyrics", lyricFields));
router.use("/news", crud("news", newsFields));
router.use("/photos", crud("photos", photoFields));
router.use("/videos", crud("videos", videoFields));
router.use("/members", crud("members", memberFields));

export default router;
