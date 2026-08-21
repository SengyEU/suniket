import { useState, useEffect } from "react";
import { api } from "../api";
import { useToast } from "../context/ToastContext";

const fields = [
  ["contact_name", "Jméno", "text"],
  ["contact_role", "Role", "text"],
  ["contact_phone", "Telefon", "text"],
  ["contact_email", "E-mail", "text"],
  ["contact_email2", "E-mail 2", "text"],
  ["contact_city", "Město", "text"],
];

const dlFields = [
  ["download_1_name", "Název stahování 1", "text"],
  ["download_1_link", "Odkaz stahování 1", "url"],
  ["download_2_name", "Název stahování 2", "text"],
  ["download_2_link", "Odkaz stahování 2", "url"],
  ["download_3_name", "Název stahování 3", "text"],
  ["download_3_link", "Odkaz stahování 3", "url"],
];

export default function ContactPage() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    api("/contact-settings").then((data) => {
      setLoading(false);
      if (data) {
        const vals = {};
        for (const [k] of fields) vals[k] = data[k] || "";
        for (const [k] of dlFields) vals[k] = data[k] || "";
        setFormData(vals);
      }
    });
  }, []);

  function setVal(key, val) {
    setFormData((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const body = {};
    for (const [k] of fields) body[k] = formData[k] || "";
    for (const [k] of dlFields) body[k] = formData[k] || "";
    const res = await api("/contact-settings", {
      method: "POST",
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res?.success) {
      setMsg("Nastavení uloženo");
      showToast("Nastavení uloženo");
    } else {
      setMsg("Chyba při ukládání");
      showToast("Chyba při ukládání", "error");
    }
    setTimeout(() => setMsg(""), 3000);
  }

  if (loading) return <div className="empty">Načítám...</div>;

  return (
    <div className="table-wrap">
      <div className="toolbar">
        <h2>Nastavení kontaktu</h2>
      </div>
      <div style={{ padding: 20 }}>
        <form onSubmit={handleSave}>
          <h3
            style={{
              fontSize: 15,
              color: "var(--accent)",
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            Kontaktní údaje
          </h3>
          {fields.map(([k, label, type]) => (
            <div key={k} className="form-group">
              <label>{label}</label>
              <input
                type={type}
                value={formData[k] || ""}
                onChange={(e) => setVal(k, e.target.value)}
              />
            </div>
          ))}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--border)",
              margin: "24px 0",
            }}
          />
          <h3
            style={{
              fontSize: 15,
              color: "var(--accent)",
              marginBottom: 16,
              fontWeight: 600,
            }}
          >
            Ke stažení
          </h3>
          {dlFields.map(([k, label, type]) => (
            <div key={k} className="form-group">
              <label>{label}</label>
              <input
                type={type}
                value={formData[k] || ""}
                onChange={(e) => setVal(k, e.target.value)}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Ukládám..." : "Uložit"}
            </button>
          </div>
          {msg && (
            <p
              style={{
                marginTop: 12,
                fontSize: 13,
                color: "var(--text2)",
              }}
            >
              {msg}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
