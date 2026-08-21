import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";
import SortToggle from "../components/SortToggle";
import { IconEdit, IconDelete, IconPlus } from "../components/icons";

const concertFields = [
  { key: "date", label: "Datum", type: "text" },
  { key: "event", label: "Událost", type: "text" },
  { key: "link", label: "Odkaz", type: "text" },
  { key: "place", label: "Místo", type: "text" },
  { key: "time", label: "Čas", type: "text" },
  { key: "entry", label: "Vstupné", type: "checkbox" },
  { key: "entry_has_link", label: "Vstupné s odkazem", type: "checkbox" },
  { key: "entry_price", label: "Cena", type: "text" },
  { key: "entry_link", label: "Odkaz na vstupenky", type: "text" },
  { key: "is_upcoming", label: "Nadcházející", type: "checkbox" },
  { key: "sort_order", label: "Pořadí", type: "number" },
];

const defaultForm = {};
concertFields.forEach((f) => {
  defaultForm[f.key] = f.type === "checkbox" ? false : "";
});

export default function ConcertsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...defaultForm });
  const { showToast } = useToast();

  const load = useCallback(async () => {
    const d = await api("/concerts") || [];
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
    const f = {};
    concertFields.forEach((cf) => {
      f[cf.key] = cf.type === "checkbox" ? !!item[cf.key] : (item[cf.key] ?? "");
    });
    setForm(f);
    setModalOpen(true);
  }

  function setField(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave(e) {
    e.preventDefault();
    const body = {};
    concertFields.forEach((cf) => {
      if (cf.type === "checkbox") body[cf.key] = form[cf.key] ? 1 : 0;
      else body[cf.key] = cf.type === "number" ? Number(form[cf.key]) : form[cf.key];
    });
    if (editing) {
      await api(`/concerts/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      showToast("Uloženo");
    } else {
      await api("/concerts", {
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
    await api(`/concerts/${id}`, { method: "DELETE" });
    showToast("Smazáno");
    load();
  }

  return (
    <div className="table-wrap">
      <div className="toolbar">
        <h2>Koncerty</h2>
        <div className="toolbar-actions">
          <SortToggle section="concerts" onToggle={load} />
            <button className="btn btn-primary" onClick={openAdd}>
            <IconPlus /> Přidat
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Událost</th>
            <th>Místo</th>
            <th>Čas</th>
            <th>Typ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((r) => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.event}</td>
                <td>{r.place}</td>
                <td>{r.time ?? "—"}</td>
                <td>
                  {r.is_upcoming ? "Nadcházející" : "Proběhlé"}
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
              <td colSpan={6} className="empty">
                <div>Žádné koncerty</div>
                <button className="cta" onClick={openAdd}>Přidat první</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Upravit koncert" : "Přidat koncert"}
      >
        <form onSubmit={handleSave}>
          {concertFields.map((cf) => {
            if (cf.type === "checkbox") {
              return (
                <div key={cf.key} className="form-group checkbox">
                  <input
                    type="checkbox"
                    checked={form[cf.key]}
                    onChange={(e) => setField(cf.key, e.target.checked)}
                  />
                  <label>{cf.label}</label>
                </div>
              );
            }
            if (cf.type === "textarea") {
              return (
                <div key={cf.key} className="form-group">
                  <label>{cf.label}</label>
                  <textarea
                    value={form[cf.key]}
                    onChange={(e) => setField(cf.key, e.target.value)}
                  />
                </div>
              );
            }
            return (
              <div key={cf.key} className="form-group">
                <label>{cf.label}</label>
                <input
                  type={cf.type}
                  value={form[cf.key]}
                  onChange={(e) => setField(cf.key, e.target.value)}
                />
              </div>
            );
          })}
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
