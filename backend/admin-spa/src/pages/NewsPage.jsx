import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";
import ImagePicker from "../components/ImagePicker";
import SortToggle from "../components/SortToggle";
import { IconEdit, IconDelete, IconPlus, IconLink } from "../components/icons";

const newsFields = [
  { key: "date", label: "Datum", type: "text" },
  { key: "title", label: "Název", type: "text" },
  { key: "description", label: "Popis", type: "textarea" },
  { key: "link", label: "Odkaz", type: "text" },
  { key: "link_text", label: "Text odkazu", type: "text" },
  { key: "sort_order", label: "Pořadí", type: "number" },
];

export default function NewsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const { showToast } = useToast();

  const load = useCallback(async () => {
    const d = await api("/news") || [];
    setData(d);
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  if (loading) return <div className="empty">Načítám...</div>;

  function openAdd() {
    setEditing(null);
    setForm({ date: "", title: "", description: "", link: "", link_text: "", sort_order: 0, image: "" });
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      date: item.date || "",
      title: item.title || "",
      description: item.description || "",
      link: item.link || "",
      link_text: item.link_text || "",
      sort_order: item.sort_order || 0,
      image: item.image || "",
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    const body = {};
    newsFields.forEach((f) => {
      body[f.key] = f.type === "number" ? Number(form[f.key]) : form[f.key];
    });
    if (form.image) body.image = form.image;

    if (editing) {
      await api(`/news/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      showToast("Uloženo");
    } else {
      await api("/news", { method: "POST", body: JSON.stringify(body) });
      showToast("Přidáno");
    }
    setModalOpen(false);
    load();
  }

  async function delItem(id) {
    if (!confirm("Opravdu smazat?")) return;
    await api(`/news/${id}`, { method: "DELETE" });
    showToast("Smazáno");
    load();
  }

  return (
    <div className="table-wrap">
      <div className="toolbar">
        <h2>Novinky</h2>
        <div className="toolbar-actions">
          <SortToggle section="news" onToggle={load} />
            <button className="btn btn-primary" onClick={openAdd}>
            <IconPlus /> Přidat
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Název</th>
            <th>Obrázek</th>
            <th>Odkaz</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((r) => (
              <tr key={r.id}>
                <td>{r.date || ""}</td>
                <td>
                  {(r.title || "").slice(0, 50)}
                  {r.title?.length > 50 ? "…" : ""}
                </td>
                <td>
                  {r.image ? (
                    <img
                      src={r.image}
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
                  {r.link ? (
                    <a href={r.link} target="_blank" rel="noreferrer">
                      <IconLink />
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
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
                <div>Žádné novinky</div>
                <button className="cta" onClick={openAdd}>Přidat první</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Upravit novinku" : "Přidat novinku"}
      >
        <form onSubmit={handleSave}>
          <ImagePicker
            label="Obrázek"
            value={form.image}
            onChange={(src) => setForm({ ...form, image: src })}
          />
          {newsFields.map((f) =>
            f.type === "textarea" ? (
              <div key={f.key} className="form-group">
                <label>{f.label}</label>
                <textarea
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                />
              </div>
            ) : (
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
    </div>
  );
}
