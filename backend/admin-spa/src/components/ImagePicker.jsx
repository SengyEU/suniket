import { useState, useRef, useEffect } from "react";
import { api, uploadFile } from "../api";
import Modal from "./Modal";

export default function ImagePicker({ value, onChange, label }) {
  const [preview, setPreview] = useState(value || "");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const fileRef = useRef(null);

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const up = await uploadFile(file);
    if (up?.src) {
      setPreview(up.src);
      onChange(up.src);
    }
  }

  async function openGallery() {
    const data = await api("/photos");
    setPhotos(data || []);
    setGalleryOpen(true);
  }

  function pickFromGallery(src) {
    setPreview(src);
    onChange(src);
    setGalleryOpen(false);
  }

  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          style={{ flex: 1 }}
          onChange={handleFile}
        />
        <button type="button" className="btn btn-sm btn-edit" onClick={openGallery}>
          Z galerie
        </button>
      </div>
      {preview && (
        <img
          src={preview}
          alt=""
          style={{
            maxWidth: 200,
            maxHeight: 100,
            marginTop: 8,
            borderRadius: 4,
            display: "block",
          }}
        />
      )}

      <Modal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        title="Vybrat fotku z galerie"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 8,
            maxHeight: "60vh",
            overflowY: "auto",
            padding: 4,
          }}
        >
          {photos.length ? (
            photos.map((p) => (
              <div
                key={p.id}
                onClick={() => pickFromGallery(p.src)}
                style={{
                  cursor: "pointer",
                  border: "2px solid transparent",
                  borderRadius: 6,
                  overflow: "hidden",
                  transition: "border-color .15s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderColor = "var(--accent)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderColor = "transparent")
                }
              >
                <img
                  src={p.src}
                  alt={p.alt || ""}
                  style={{
                    width: "100%",
                    height: 80,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ))
          ) : (
            <p style={{ color: "var(--text2)" }}>Žádné fotky v galerii</p>
          )}
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-cancel"
            onClick={() => setGalleryOpen(false)}
          >
            Zrušit
          </button>
        </div>
      </Modal>
    </div>
  );
}
