import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";
import SortToggle from "../components/SortToggle";
import { IconEdit, IconDelete, IconPlus } from "../components/icons";

const fields = [
  { key: "youtube_id", label: "YouTube ID", type: "text" },
  { key: "sort_order", label: "Pořadí", type: "number" },
];

const defaultForm = {};
fields.forEach((f) => {
  defaultForm[f.key] = f.type === "number" ? 0 : "";
});

export default function VideosPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...defaultForm });
  const { showToast } = useToast();

  const load = useCallback(async () => {
    const d = await api("/videos") || [];
    setData(d);
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  if (loading) return <div className="empty">Načítám...</div>;

  function openAdd() {
    setEditing(null);
    setForm({ ...defaultForm });
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      youtube_id: item.youtube_id || "",
      sort_order: item.sort_order || 0,
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    const body = {
      youtube_id: form.youtube_id,
      sort_order: Number(form.sort_order || 0),
    };
    if (editing) {
      await api(`/videos/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      showToast("Uloženo");
    } else {
      await api("/videos", { method: "POST", body: JSON.stringify(body) });
      showToast("Přidáno");
    }
    setModalOpen(false);
    load();
  }

  async function delItem(id) {
    if (!confirm("Opravdu smazat?")) return;
    await api(`/videos/${id}`, { method: "DELETE" });
    showToast("Smazáno");
    load();
  }

  return (
    <div className="table-wrap">
      <div className="toolbar">
        <h2>Videa</h2>
        <div className="toolbar-actions">
          <SortToggle section="videos" onToggle={load} />
            <button className="btn btn-primary" onClick={openAdd}>
            <IconPlus /> Přidat
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>YouTube ID</th>
            <th>Pořadí</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((r) => (
              <tr key={r.id}>
                <td>{r.youtube_id}</td>
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
              <td colSpan={3} className="empty">
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
        title={editing ? "Upravit video" : "Přidat video"}
      >
        <form onSubmit={handleSave}>
          {fields.map((f) => (
            <div key={f.key} className="form-group">
              <label>{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: e.target.value })
                }
              />
            </div>
          ))}
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
