import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "suniket.db");

let db;

function save() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
}

export async function initDb() {
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }
  db.run("PRAGMA foreign_keys = ON");
  db.run(`CREATE TABLE IF NOT EXISTS timeline (
    id INTEGER PRIMARY KEY AUTOINCREMENT, year TEXT NOT NULL, text TEXT NOT NULL,
    img TEXT, alt TEXT, sort_order INTEGER DEFAULT 0
  );`);
  db.run(`CREATE TABLE IF NOT EXISTS concerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, is_upcoming INTEGER NOT NULL DEFAULT 1,
    date TEXT NOT NULL, event TEXT NOT NULL, link TEXT, place TEXT NOT NULL,
    time TEXT, entry INTEGER NOT NULL DEFAULT 0, entry_has_link INTEGER NOT NULL DEFAULT 0,
    entry_price TEXT, entry_link TEXT, sort_order INTEGER DEFAULT 0
  );`);
  db.run(`CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, cover TEXT,
    description TEXT, sort_order INTEGER DEFAULT 0
  );`);
  db.run(`CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT, album_id INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    title TEXT NOT NULL, sort_order INTEGER DEFAULT 0
  );`);
  db.run(`CREATE TABLE IF NOT EXISTS lyrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT, song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    line TEXT NOT NULL, line_order INTEGER DEFAULT 0, sort_order INTEGER DEFAULT 0
  );`);
  db.run(`CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, title TEXT NOT NULL,
    description TEXT NOT NULL, image TEXT, link TEXT, link_text TEXT, sort_order INTEGER DEFAULT 0
  );`);
  db.run(`CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT, src TEXT NOT NULL, alt TEXT, sort_order INTEGER DEFAULT 0
  );`);
  db.run(`CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT, youtube_id TEXT NOT NULL, sort_order INTEGER DEFAULT 0
  );`);
  db.run(`CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, role TEXT NOT NULL,
    photo TEXT, description TEXT, equipment TEXT, sort_order INTEGER DEFAULT 0
  );`);

  for (const t of ["timeline", "concerts", "albums", "songs", "lyrics", "news", "photos", "videos", "members"]) {
    try { db.run(`ALTER TABLE ${t} ADD COLUMN sort_order INTEGER DEFAULT 0`); } catch (_) {}
  }
  try { db.run("ALTER TABLE members ADD COLUMN description TEXT"); } catch (_) {}
  try { db.run("ALTER TABLE members ADD COLUMN equipment TEXT"); } catch (_) {}

  return db;
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function one(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  let row = null;
  if (stmt.step()) row = stmt.getAsObject();
  stmt.free();
  return row;
}

function run(sql, params = []) {
  db.run(sql, params);
  const row = one("SELECT last_insert_rowid() as id");
  save();
  return { lastInsertRowid: row?.id ?? null };
}

function exec(sql) {
  db.run(sql);
  save();
}

export default { all, one, run, exec };
