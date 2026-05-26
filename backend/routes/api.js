import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/timeline", (_req, res) => {
  const rows = db.all("SELECT * FROM timeline ORDER BY sort_order ASC");
  res.json(rows);
});

router.get("/concerts", (_req, res) => {
  const rows = db.all("SELECT * FROM concerts ORDER BY sort_order ASC");
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

router.get("/discography", (_req, res) => {
  const albums = db.all("SELECT * FROM albums ORDER BY sort_order ASC");
  const allSongs = db.all("SELECT * FROM songs ORDER BY sort_order ASC");
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
      songs: songsByAlbum[a.id] || [],
    })),
  });
});

router.get("/news", (_req, res) => {
  const rows = db.all("SELECT * FROM news ORDER BY sort_order ASC");
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

router.get("/photos", (_req, res) => {
  const rows = db.all("SELECT * FROM photos ORDER BY sort_order ASC");
  res.json(rows.map((r) => ({ src: r.src, alt: r.alt })));
});

router.get("/videos", (_req, res) => {
  const rows = db.all("SELECT * FROM videos ORDER BY sort_order ASC");
  res.json(rows.map((r) => r.youtube_id));
});

router.get("/members", (_req, res) => {
  const rows = db.all("SELECT * FROM members ORDER BY sort_order ASC");
  res.json(rows);
});

export default router;
