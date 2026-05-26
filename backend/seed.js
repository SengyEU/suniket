import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db.js";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.argv[2] || path.join(__dirname, "data");

function loadJSON(name) {
  const fp = path.join(dataDir, `${name}.json`);
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

async function seed() {
  await initDb();

  db.exec("DELETE FROM lyrics; DELETE FROM songs; DELETE FROM albums; DELETE FROM concerts; DELETE FROM timeline; DELETE FROM news; DELETE FROM photos; DELETE FROM videos; DELETE FROM members;");

  const timeline = loadJSON("about");
  for (let i = 0; i < timeline.length; i++) {
    db.run("INSERT INTO timeline (year, text, img, alt, sort_order) VALUES (?, ?, ?, ?, ?)",
      [timeline[i].year, timeline[i].text, timeline[i].img || null, timeline[i].alt || null, i]);
  }

  const concerts = loadJSON("concerts");
  for (const [type, items] of Object.entries(concerts)) {
    const isUpcoming = type === "upcoming" ? 1 : 0;
    for (let i = 0; i < items.length; i++) {
      const c = items[i];
      db.run(`INSERT INTO concerts (is_upcoming, date, event, link, place, time, entry, entry_has_link, entry_price, entry_link, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [isUpcoming, c.date, c.event, c.link || null, c.place, c.time || null,
        c.entry ? 1 : 0, c.entryHasLink ? 1 : 0, c.entryPrice || null, c.entryLink || null, i]);
    }
  }

  const disc = loadJSON("discography");
  for (let ai = 0; ai < disc.albums.length; ai++) {
    const a = disc.albums[ai];
    const aRes = db.run("INSERT INTO albums (title, cover, description, sort_order) VALUES (?, ?, ?, ?)",
      [a.title, a.cover || null, a.description || null, ai]);
    for (let si = 0; si < a.songs.length; si++) {
      const s = a.songs[si];
      const sRes = db.run("INSERT INTO songs (album_id, title, sort_order) VALUES (?, ?, ?)",
        [aRes.lastInsertRowid, s.title, si]);
      for (let li = 0; li < (s.lyrics || []).length; li++) {
        db.run("INSERT INTO lyrics (song_id, line, line_order, sort_order) VALUES (?, ?, ?, ?)",
          [sRes.lastInsertRowid, s.lyrics[li], li, li]);
      }
    }
  }

  const news = loadJSON("news");
  for (let i = 0; i < news.articles.length; i++) {
    const n = news.articles[i];
    db.run("INSERT INTO news (date, title, description, image, link, link_text, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [n.date, n.title, n.description, n.image || null, n.link || null, n.linkText || null, i]);
  }

  const photos = loadJSON("photos");
  for (let i = 0; i < photos.length; i++) {
    db.run("INSERT INTO photos (src, alt, sort_order) VALUES (?, ?, ?)",
      [photos[i].src, photos[i].alt || null, i]);
  }

  const videos = loadJSON("videos");
  for (let i = 0; i < videos.length; i++) {
    db.run("INSERT INTO videos (youtube_id, sort_order) VALUES (?, ?)", [videos[i], i]);
  }

  const members = loadJSON("members");
  for (let i = 0; i < members.length; i++) {
    db.run("INSERT INTO members (name, role, photo, description, equipment, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      [members[i].name, members[i].role, members[i].photo || null, members[i].description || null, members[i].equipment || null, i]);
  }

  console.log("Seed complete — imported all data from JSON files.");
}

seed();
