import { useState, useEffect } from "react";
import { api } from "../api";
import { IconSort } from "./icons";

export default function SortToggle({ section, onToggle }) {
  const [dir, setDir] = useState("asc");

  useEffect(() => {
    api("/sort-dir").then((data) => {
      if (data && data[section]) setDir(data[section]);
    });
  }, [section]);

  async function toggle() {
    const next = dir === "asc" ? "desc" : "asc";
    await api("/sort-dir", {
      method: "POST",
      body: JSON.stringify({ section, dir: next }),
    });
    setDir(next);
    if (onToggle) onToggle(next);
  }

  return (
    <button
      className="btn btn-sm btn-edit"
      onClick={toggle}
      title="Změnit řazení"
    >
      <IconSort dir={dir} />
    </button>
  );
}
