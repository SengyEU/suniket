import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";
import ImagePicker from "../components/ImagePicker";
import SortToggle from "../components/SortToggle";
import { IconEdit, IconDelete, IconPlus } from "../components/icons";

const fields = [
  { key: "year", label: "Rok", type: "text" },
  { key: "text", label: "Text", type: "textarea" },
  { key: "alt", label: "Alt text", type: "text" },
  { key: "sort_order", label: "Pořadí", type: "number" },
];

export default function TimelinePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const { showToast } = useToast();

  const load = useCallback(async () => {
    const d = await api("/timeline") || [];
    setData(d);
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  if (loading) return <div className="empty">Načítám...</div>;

  function openAdd() {
    setEditing(null);
    setForm({ year: "", text: "", alt: "", sort_order: 0, img: "" });
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      year: item.year || "",
      text: item.text || "",
      alt: item.alt || "",
      sort_order: item.sort_order || 0,
      img: item.img || "",
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    const body = {
      year: form.year,
      text: form.text,
      alt: form.alt || "",
      sort_order: Number(form.sort_order || 0),
    };
    if (form.img) body.img = form.img;

    if (editing) {
      await api(`/timeline/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      showToast("Uloženo");
    } else {
      await api("/timeline", {
        method: "POST",
        body: JSON.stringify(body),
      });
      showToast("Přidáno");
    }
    setModalOpen(false);
    load();
  }

  async function delItem(id) {
    if (!confirm("Opravdu smazat?")) return;
    await api(`/timeline/${id}`, { method: "DELETE" });
    showToast("Smazáno");
    load();
  }

  return (
    <div className="table-wrap">
      <div className="toolbar">
        <h2>Timeline (O kapele)</h2>
        <div className="toolbar-actions">
          <SortToggle section="timeline" onToggle={load} />
            <button className="btn btn-primary" onClick={openAdd}>
            <IconPlus /> Přidat
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Rok</th>
            <th>Text</th>
            <th>Obrázek</th>
            <th>Pořadí</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((r) => (
              <tr key={r.id}>
                <td>{r.year || ""}</td>
                <td>
                  {(r.text || "").slice(0, 60)}
                  {r.text?.length > 60 ? "…" : ""}
                </td>
                <td>
                  {r.img ? (
                    <img
                      src={r.img}
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
                <td>{r.sort_order}</td>
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
              <td colSpan={5} className="empty">
                <div>Žádné záznamy</div>
                <button className="cta" onClick={openAdd}>Přidat první</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Upravit položku timeline" : "Přidat do timeline"}
      >
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Rok</label>
            <input
              type="text"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Text</label>
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
            />
          </div>
          <ImagePicker
            label="Obrázek"
            value={form.img}
            onChange={(src) => setForm({ ...form, img: src })}
          />
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
    </div>
  );
}
