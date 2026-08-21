import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";
import ImagePicker from "../components/ImagePicker";
import SortToggle from "../components/SortToggle";
import { IconEdit, IconDelete, IconPlus } from "../components/icons";

const albumFields = [
  { key: "title", label: "Název alba", type: "text" },
  { key: "description", label: "Popis", type: "textarea" },
  { key: "link_text", label: "Text odkazu (např. Bandzone, Spotify)", type: "text" },
  { key: "link", label: "URL odkazu", type: "text" },
  { key: "sort_order", label: "Pořadí", type: "number" },
];

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [lyrics, setLyrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [songModal, setSongModal] = useState(false);
  const [songForm, setSongForm] = useState({});
  const [songAlbumId, setSongAlbumId] = useState(null);
  const [songEditing, setSongEditing] = useState(null);
  const [lyricsModal, setLyricsModal] = useState(false);
  const [lyricsText, setLyricsText] = useState("");
  const [lyricsSongId, setLyricsSongId] = useState(null);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    const [a, s, l] = await Promise.all([
      api("/albums") || [],
      api("/songs") || [],
      api("/lyrics") || [],
    ]);
    setAlbums(a);
    setSongs(s);
    setLyrics(l);
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  if (loading) return <div className="empty">Načítám...</div>;

  const lyricsBySong = {};
  (lyrics || []).forEach((l) => {
    if (!lyricsBySong[l.song_id]) lyricsBySong[l.song_id] = [];
    lyricsBySong[l.song_id].push(l);
  });
  const songsByAlbum = {};
  (songs || []).forEach((s) => {
    if (!songsByAlbum[s.album_id]) songsByAlbum[s.album_id] = [];
    songsByAlbum[s.album_id].push(s);
  });

  /* Album CRUD */
  function openAlbumAdd() {
    setEditing(null);
    setForm({ title: "", description: "", link_text: "", link: "", sort_order: 0, cover: "" });
    setModalOpen(true);
  }

  function openAlbumEdit(item) {
    setEditing(item);
    setForm({
      title: item.title || "",
      description: item.description || "",
      link_text: item.link_text || "",
      link: item.link || "",
      sort_order: item.sort_order || 0,
      cover: item.cover || "",
    });
    setModalOpen(true);
  }

  async function handleAlbumSave(e) {
    e.preventDefault();
    const body = {
      title: form.title,
      description: form.description,
      link_text: form.link_text,
      link: form.link,
      sort_order: Number(form.sort_order || 0),
    };
    if (form.cover) body.cover = form.cover;
    if (editing) {
      await api(`/albums/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      showToast("Album uloženo");
    } else {
      await api("/albums", {
        method: "POST",
        body: JSON.stringify(body),
      });
      showToast("Album přidáno");
    }
    setModalOpen(false);
    load();
  }

  async function delAlbum(id) {
    if (!confirm("Opravdu smazat album i se všemi skladbami?")) return;
    await api(`/albums/${id}`, { method: "DELETE" });
    showToast("Album smazáno");
    load();
  }

  /* Song CRUD */
  function openSongAdd(albumId) {
    setSongEditing(null);
    setSongForm({ title: "", sort_order: 0 });
    setSongAlbumId(albumId);
    setSongModal(true);
  }

  function openSongEdit(item) {
    setSongEditing(item);
    setSongForm({ title: item.title, sort_order: item.sort_order });
    setSongAlbumId(null);
    setSongModal(true);
  }

  async function handleSongSave(e) {
    e.preventDefault();
    const body = {
      title: songForm.title,
      sort_order: Number(songForm.sort_order || 0),
    };
    if (songEditing) {
      await api(`/songs/${songEditing.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      showToast("Skladba uložena");
    } else {
      body.album_id = songAlbumId;
      await api("/songs", { method: "POST", body: JSON.stringify(body) });
      showToast("Skladba přidána");
    }
    setSongModal(false);
    load();
  }

  async function delSong(id) {
    if (!confirm("Smazat skladbu?")) return;
    await api(`/songs/${id}`, { method: "DELETE" });
    showToast("Skladba smazána");
    load();
  }

  /* Lyrics CRUD */
  function openLyricsEdit(songId) {
    const lines = (lyricsBySong[songId] || [])
      .sort((a, b) => a.line_order - b.line_order)
      .map((l) => l.line);
    setLyricsText(lines.join("\n"));
    setLyricsSongId(songId);
    setLyricsModal(true);
  }

  async function handleLyricsSave(e) {
    e.preventDefault();
    const existing = lyricsBySong[lyricsSongId] || [];
    const newLines = lyricsText.split("\n");
    for (const l of existing) {
      await api(`/lyrics/${l.id}`, { method: "DELETE" });
    }
    for (let i = 0; i < newLines.length; i++) {
      await api("/lyrics", {
        method: "POST",
        body: JSON.stringify({
          song_id: lyricsSongId,
          line: newLines[i],
          line_order: i,
        }),
      });
    }
    setLyricsModal(false);
    showToast("Text uložen");
    load();
  }

  return (
    <div className="table-wrap">
      <div className="toolbar">
        <h2>Alba</h2>
        <div className="toolbar-actions">
          <SortToggle section="albums" onToggle={load} />
            <button className="btn btn-primary" onClick={openAlbumAdd}>
            <IconPlus /> Přidat album
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Název</th>
            <th>Cover</th>
            <th>Skladby</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {albums.length ? (
            albums.map((a) => (
              <tr key={a.id}>
                <td>
                  <strong>{a.title}</strong>
                </td>
                <td>
                  {a.cover ? (
                    <img
                      src={a.cover}
                      alt=""
                      style={{
                        width: 60,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <ul className="song-list">
                    {(songsByAlbum[a.id] || []).map((s) => (
                      <li key={s.id}>
                        <span>
                          <strong>{s.title}</strong>
                          {(lyricsBySong[s.id] || []).length ? (
                            <div className="lyrics-preview">
                              {(lyricsBySong[s.id] || [])
                                .slice(0, 3)
                                .map((l) => l.line)
                                .join(" / ")}
                              {(lyricsBySong[s.id] || []).length > 3
                                ? "…"
                                : ""}
                            </div>
                          ) : (
                            ""
                          )}
                        </span>
                        <span className="mini-actions">
                          <button
                            className="btn btn-icon"
                            onClick={() => openSongEdit(s)}
                            title="Upravit skladbu"
                          >
                            <IconEdit />
                          </button>
                          <button
                            className="btn btn-icon"
                            onClick={() => openLyricsEdit(s.id)}
                            title="Upravit text"
                          >
                            <IconEdit />
                          </button>
                          <button
                            className="btn btn-icon"
                            onClick={() => delSong(s.id)}
                            title="Smazat"
                            style={{ color: "var(--accent)" }}
                          >
                            <IconDelete />
                          </button>
                        </span>
                      </li>
                    ))}
                    <li>
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => openSongAdd(a.id)}
                        style={{ width: "100%" }}
                      >
                        <IconPlus /> Přidat skladbu
                      </button>
                    </li>
                  </ul>
                </td>
                <td className="actions">
                  <button
                    className="btn btn-sm btn-edit"
                    onClick={() => openAlbumEdit(a)}
                  >
                    <IconEdit />
                  </button>{" "}
                  <button
                    className="btn btn-sm btn-del"
                    onClick={() => delAlbum(a.id)}
                  >
                    <IconDelete />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="empty">
                <div>Žádná alba</div>
                <button className="cta" onClick={openAlbumAdd}>Přidat první</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Album modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Upravit album" : "Přidat album"}
      >
        <form onSubmit={handleAlbumSave}>
          <ImagePicker
            label="Cover obrázek"
            value={form.cover}
            onChange={(src) => setForm({ ...form, cover: src })}
          />
          {albumFields.map((f) =>
            f.type === "textarea" ? (
              <div key={f.key} className="form-group">
                <label>{f.label}</label>
                <textarea
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            ) : (
              <div key={f.key} className="form-group">
                <label>{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              </div>
            )
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => setModalOpen(false)}
            >
              Zrušit
            </button>
            <button type="submit" className="btn btn-primary">
              Uložit
            </button>
          </div>
        </form>
      </Modal>

      {/* Song modal */}
      <Modal
        open={songModal}
        onClose={() => setSongModal(false)}
        title={songEditing ? "Upravit skladbu" : "Přidat skladbu"}
      >
        <form onSubmit={handleSongSave}>
          <div className="form-group">
            <label>Název skladby</label>
            <input
              type="text"
              value={songForm.title}
              onChange={(e) => setSongForm({ ...songForm, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Pořadí</label>
            <input
              type="number"
              value={songForm.sort_order}
              onChange={(e) =>
                setSongForm({ ...songForm, sort_order: e.target.value })
              }
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => setSongModal(false)}
            >
              Zrušit
            </button>
            <button type="submit" className="btn btn-primary">
              Uložit
            </button>
          </div>
        </form>
      </Modal>

      {/* Lyrics modal */}
      <Modal
        open={lyricsModal}
        onClose={() => setLyricsModal(false)}
        title="Upravit text skladby"
      >
        <p
          className="hint"
          style={{
            marginBottom: 16,
            fontSize: 13,
            color: "var(--text2)",
          }}
        >
          Každý řádek zvlášť. Prázdné řádky budou odstraněny.
        </p>
        <form onSubmit={handleLyricsSave}>
          <div className="form-group">
            <textarea
              rows={15}
              style={{ fontFamily: "inherit", whiteSpace: "pre" }}
              value={lyricsText}
              onChange={(e) => setLyricsText(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => setLyricsModal(false)}
            >
              Zrušit
            </button>
            <button type="submit" className="btn btn-primary">
              Uložit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
