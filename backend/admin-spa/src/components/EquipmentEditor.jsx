import { useState } from "react";

export default function EquipmentEditor({ value, onChange }) {
  const [items, setItems] = useState(() => {
    try {
      return value ? JSON.parse(value) : [];
    } catch {
      return [];
    }
  });

  function updateItems(newItems) {
    setItems(newItems);
    const json =
      newItems.length ? JSON.stringify(newItems) : null;
    onChange(json);
  }

  function addItem() {
    updateItems([...items, { name: "", link: "" }]);
  }

  function removeItem(i) {
    const next = items.filter((_, idx) => idx !== i);
    updateItems(next);
  }

  function setField(i, field, val) {
    const next = items.map((item, idx) =>
      idx === i ? { ...item, [field]: val } : item
    );
    updateItems(next);
  }

  return (
    <div className="form-group">
      <label>Vybavení</label>
      <div id="equipment-list">
        {items.map((item, i) => (
          <div
            key={i}
            className="equipment-row"
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <input
              type="text"
              value={item.name}
              placeholder="Název"
              style={{ flex: 2 }}
              onChange={(e) => setField(i, "name", e.target.value)}
            />
            <input
              type="text"
              value={item.link || ""}
              placeholder="Odkaz (volitelný)"
              style={{ flex: 2 }}
              onChange={(e) => setField(i, "link", e.target.value)}
            />
              <button
                type="button"
                className="btn btn-sm btn-del"
                onClick={() => removeItem(i)}
              >
                Smazat
              </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-sm btn-edit"
        onClick={addItem}
        style={{ marginTop: 8 }}
      >
        + Přidat položku
      </button>
    </div>
  );
}
