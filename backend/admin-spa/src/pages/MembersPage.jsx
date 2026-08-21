import { useState, useEffect, useCallback } from "react";
import { api } from "../api";
import { useToast } from "../context/ToastContext";
import Modal from "../components/Modal";
import ImagePicker from "../components/ImagePicker";
import EquipmentEditor from "../components/EquipmentEditor";
import SortToggle from "../components/SortToggle";
import { IconEdit, IconDelete, IconPlus } from "../components/icons";

const memberFields = [
  { key: "name", label: "Jméno", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "description", label: "Popis", type: "textarea" },
  { key: "sort_order", label: "Pořadí", type: "number" },
];

export default function MembersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const { showToast } = useToast();

  const load = useCallback(async () => {
    const d = await api("/members") || [];
    setData(d);
  }, []);

  useEffect(() => { load().finally(() => setLoading(false)); }, [load]);

  if (loading) return <div className="empty">Načítám...</div>;

  function openAdd() {
    setEditing(null);
    setForm({
      name: "", role: "", description: "", sort_order: 0,
      photo: "", equipment: null
    });
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      name: item.name || "",
      role: item.role || "",
      description: item.description || "",
      sort_order: item.sort_order || 0,
      photo: item.photo || "",
      equipment: item.equipment || null,
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    const body = {};
    memberFields.forEach((f) => {
      body[f.key] = f.type === "number" ? Number(form[f.key]) : form[f.key];
    });
    if (form.photo) body.photo = form.photo;
    body.equipment = form.equipment;

    if (editing) {
      await api(`/members/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      showToast("Člen uložen");
    } else {
      await api("/members", { method: "POST", body: JSON.stringify(body) });
      showToast("Člen přidán");
    }
    setModalOpen(false);
    load();
  }

  async function delItem(id) {
    if (!confirm("Opravdu smazat?")) return;
    await api(`/members/${id}`, { method: "DELETE" });
    showToast("Smazáno");
    load();
  }

  return (
    <div className="table-wrap">
      <div className="toolbar">
        <h2>Členové kapely</h2>
        <div className="toolbar-actions">
          <SortToggle section="members" onToggle={load} />
            <button className="btn btn-primary" onClick={openAdd}>
            <IconPlus /> Přidat
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Jméno</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.photo ? (
                    <img
                      src={r.photo}
                      alt=""
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <strong>{r.name || ""}</strong>
                </td>
                <td>{r.role || ""}</td>
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
                <div>Žádní členové</div>
                <button className="cta" onClick={openAdd}>Přidat první</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Upravit člena" : "Přidat člena"}
      >
        <form onSubmit={handleSave}>
          <ImagePicker
            label="Fotka"
            value={form.photo}
            onChange={(src) => setForm({ ...form, photo: src })}
          />
          {memberFields.map((f) =>
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
          <EquipmentEditor
            value={form.equipment}
            onChange={(json) => setForm({ ...form, equipment: json })}
          />
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
