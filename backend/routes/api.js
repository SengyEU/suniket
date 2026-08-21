import { Router } from "express";
import db, { safeDir } from "../db.js";

const router = Router();

function sortDir(req, table) {
  const q = req.query.sort;
  if (q === "asc" || q === "desc") return safeDir(q);
  return safeDir(db.getSortDir(table));
}

router.get("/timeline", (req, res) => {
  const rows = db.all(`SELECT * FROM timeline ORDER BY sort_order ${sortDir(req, "timeline")}`);
  res.json(rows);
});

router.get("/concerts", (req, res) => {
  const dir = sortDir(req, "concerts");
  const rows = db.all(`SELECT * FROM concerts ORDER BY sort_order ${dir}`);
  const upcoming = rows.filter((r) => r.is_upcoming).map(fmtConcert);
  const past = rows.filter((r) => !r.is_upcoming).map(fmtConcert);
  res.json({ upcoming, past });
});

function fmtConcert(r) {
  return {
    date: r.date,
    event: r.event,
    ...(r.link ? { link: r.link } : {}),
    place: r.place,
    time: r.time,
    entry: !!r.entry,
    ...(r.entry_has_link ? { entryHasLink: true } : {}),
    ...(r.entry_price ? { entryPrice: r.entry_price } : {}),
    ...(r.entry_link ? { entryLink: r.entry_link } : {}),
  };
}

router.get("/discography", (req, res) => {
  const dir = sortDir(req, "albums");
  const albums = db.all(`SELECT * FROM albums ORDER BY sort_order ${dir}`);
  const allSongs = db.all(`SELECT * FROM songs ORDER BY sort_order ${dir}`);
  const allLyrics = db.all("SELECT * FROM lyrics ORDER BY line_order ASC");

  const lyricsBySong = {};
  for (const l of allLyrics) {
    if (!lyricsBySong[l.song_id]) lyricsBySong[l.song_id] = [];
    lyricsBySong[l.song_id].push(l.line);
  }

  const songsByAlbum = {};
  for (const s of allSongs) {
    if (!songsByAlbum[s.album_id]) songsByAlbum[s.album_id] = [];
    songsByAlbum[s.album_id].push({
      title: s.title,
      lyrics: lyricsBySong[s.id] || [],
    });
  }

  res.json({
    albums: albums.map((a) => ({
      title: a.title,
      cover: a.cover,
      description: a.description,
      link_text: a.link_text || null,
      link: a.link || null,
      songs: songsByAlbum[a.id] || [],
    })),
  });
});

router.get("/news", (req, res) => {
  const rows = db.all(`SELECT * FROM news ORDER BY sort_order ${sortDir(req, "news")}`);
  res.json({
    articles: rows.map((r) => ({
      id: String(r.id),
      date: r.date,
      title: r.title,
      description: r.description,
      ...(r.image ? { image: r.image } : {}),
      ...(r.link ? { link: r.link } : {}),
      ...(r.link_text ? { linkText: r.link_text } : {}),
    })),
  });
});

router.get("/photos", (req, res) => {
  const rows = db.all(`SELECT * FROM photos ORDER BY sort_order ${sortDir(req, "photos")}`);
  res.json(rows.map((r) => ({ src: r.src, thumb: r.thumb || r.src, alt: r.alt })));
});

function youtubeId(val) {
  if (!val) return "";
  const m = val.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : val.trim();
}

router.get("/videos", (req, res) => {
  const rows = db.all(`SELECT * FROM videos ORDER BY sort_order ${sortDir(req, "videos")}`);
  res.json(rows.map((r) => youtubeId(r.youtube_id)));
});

const latestVideoCache = { data: null, expiry: 0 };

const CHANNEL_ID = "UCyVe08FDN_amn5ixl78b0mA";

router.get("/latest-video", async (_req, res) => {
  try {
    if (latestVideoCache.data && Date.now() < latestVideoCache.expiry) {
      return res.json(latestVideoCache.data);
    }

    const resp = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; SuniketBot/1.0)" } },
    );
    if (!resp.ok) {
      return res.status(502).json({ error: `RSS fetch failed: ${resp.status}` });
    }
    const xml = await resp.text();

    // find <entry> blocks and check their <link rel="alternate"> for /shorts/
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
    for (const [, body] of entries) {
      const idMatch = body.match(/<yt:videoId>([a-zA-Z0-9_-]{11})<\/yt:videoId>/);
      const linkMatch = body.match(/<link rel="alternate"[^>]*href="([^"]+)"/);
      if (!idMatch || !linkMatch) continue;
      if (linkMatch[1].includes("/shorts/")) continue;
      latestVideoCache.data = { videoId: idMatch[1] };
      latestVideoCache.expiry = Date.now() + 600_000;
      return res.json(latestVideoCache.data);
    }

    return res.status(404).json({ error: "No non-Shorts video found", entries: entries.length });
  } catch (err) {
    console.error("latest-video error:", err);
    return res.status(500).json({ error: "Failed to fetch latest video", detail: err.message });
  }
});

router.get("/members", (req, res) => {
  const rows = db.all(`SELECT * FROM members ORDER BY sort_order ${sortDir(req, "members")}`);
  res.json(rows);
});

router.get("/contact-settings", (req, res) => {
  const rows = db.all("SELECT * FROM settings WHERE key LIKE 'contact_%' OR key LIKE 'download_%'");
  const out = {};
  for (const r of rows) out[r.key] = r.value;
  res.json(out);
});

export default router;
