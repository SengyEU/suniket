import { useState, useEffect, useCallback, useRef } from "react";
import { api, uploadFile } from "../api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";
import SortToggle from "../components/SortToggle";
import { IconEdit, IconDelete, IconPlus } from "../components/icons";

export default function PhotosPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [massUploadOpen, setMassUploadOpen] = useState(false);
  const [massFiles, setMassFiles] = useState(null);
  const [massAlt, setMassAlt] = useState("");
  const [massProgress, setMassProgress] = useState("");
  const [massUploading, setMassUploading] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(async () => {
    const d = await api("/photos") || [];
    setData(d);
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  if (loading) return <div className="empty">Načítám...</div>;

  function openAdd() {
    setEditing(null);
    setForm({ alt: "", sort_order: 0, file: null });
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({ alt: item.alt || "", sort_order: item.sort_order || 0, file: null });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    let src = editing ? editing.src : "";
    if (form.file) {
      const up = await uploadFile(form.file);
      if (up?.src) src = up.src;
      else { showToast("Nahrávání selhalo", "error"); return; }
    }
    const body = { src, alt: form.alt || "", sort_order: Number(form.sort_order || 0) };
    if (editing) {
      await api(`/photos/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
      showToast("Fotka uložena");
    } else {
      if (!form.file) { showToast("Vyber soubor", "error"); return; }
      await api("/photos", { method: "POST", body: JSON.stringify(body) });
      showToast("Fotka přidána");
    }
    setModalOpen(false);
    load();
  }

  async function delItem(id) {
    if (!confirm("Opravdu smazat?")) return;
    await api(`/photos/${id}`, { method: "DELETE" });
    showToast("Smazáno");
    load();
  }

  async function handleMassUpload(e) {
    e.preventDefault();
    const files = massFiles;
    if (!files || !files.length) { showToast("Vyber soubory", "error"); return; }
    setMassUploading(true);
    let ok = 0, fail = 0;
    for (let i = 0; i < files.length; i++) {
      setMassProgress(`Nahrávám ${i + 1}/${files.length}...`);
      const up = await uploadFile(files[i]);
      if (up?.src) {
        await api("/photos", {
          method: "POST",
          body: JSON.stringify({ src: up.src, alt: massAlt.trim() }),
        });
        ok++;
      } else {
        fail++;
      }
    }
    setMassProgress(
      ok
        ? `<span style="color:#2d6a4f">✅ Nahráno ${ok} fotek</span>`
          + (fail ? `<span style="color:var(--accent);margin-left:8px">❌ ${fail} selhalo</span>` : "")
        : ""
    );
    setMassUploading(false);
    setTimeout(() => {
      setMassUploadOpen(false);
      setMassProgress("");
      load();
    }, 1500);
  }

  return (
    <div className="table-wrap">
      <div className="toolbar">
        <h2>Fotky</h2>
        <div className="toolbar-actions">
          <SortToggle section="photos" onToggle={load} />
          <button
            className="btn btn-sm btn-edit"
            onClick={() => { setMassFiles(null); setMassAlt(""); setMassProgress(""); setMassUploadOpen(true); }}
            style={{ border: "1px solid var(--accent)" }}
          >
            Hromadné nahrávání
          </button>
            <button className="btn btn-primary" onClick={openAdd}>
            <IconPlus /> Přidat
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Náhled</th>
            <th>Cesta</th>
            <th>Alt text</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((r) => (
              <tr key={r.id}>
                <td>
                  <img
                    src={r.thumb || r.src}
                    alt={r.alt}
                    style={{
                      width: 60,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                </td>
                <td>{(r.src || "").slice(0, 30)}…</td>
                <td>{r.alt || ""}</td>
                <td className="actions">
                  <button
                    className="btn btn-sm btn-edit"
                    onClick={() => openEdit(r)}
                  >
                    <IconEdit />
                  </button>{" "}
                  <button
                    className="btn btn-sm btn-del"
                    onClick={() => delItem(r.id)}
                  >
                    <IconDelete />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="empty">
                <div>Žádné fotky</div>
                <button className="cta" onClick={openAdd}>Přidat první</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add / Edit single photo */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Upravit fotku" : "Přidat fotku"}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>{editing ? "Soubor (nechat prázdné = ponechat stávající)" : "Soubor (JPG/PNG)"}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            />
          </div>
          {editing?.src && (
            <div style={{ marginBottom: 12 }}>
              <img
                src={editing.src}
                alt=""
                style={{ maxWidth: 200, maxHeight: 120, borderRadius: 4 }}
              />
            </div>
          )}
          <div className="form-group">
            <label>Alt text</label>
            <input
              type="text"
              value={form.alt}
              onChange={(e) => setForm({ ...form, alt: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Pořadí</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) =>
                setForm({ ...form, sort_order: e.target.value })
              }
            />
          </div>
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

      {/* Mass upload */}
      <Modal
        open={massUploadOpen}
        onClose={() => setMassUploadOpen(false)}
        title="Hromadné nahrávání fotek"
      >
        <form onSubmit={handleMassUpload}>
          <div className="form-group">
            <label>Vyberte fotky (lze vybrat více najednou)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setMassFiles(e.target.files)}
            />
          </div>
          <div className="form-group">
            <label>Alt text (platí pro všechny fotky)</label>
            <input
              type="text"
              value={massAlt}
              onChange={(e) => setMassAlt(e.target.value)}
              placeholder="nepovinné"
            />
          </div>
          {massProgress && (
            <div
              style={{ marginBottom: 12, fontSize: 13 }}
              dangerouslySetInnerHTML={{ __html: massProgress }}
            />
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={() => setMassUploadOpen(false)}
            >
              Zrušit
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={massUploading}
            >
              {massUploading ? "Nahrávám..." : "Nahrát"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
