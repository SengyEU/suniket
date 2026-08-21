import { useEffect, useRef } from "react";
import { IconClose } from "./icons";

export default function Modal({ open, onClose, title, children }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`modal-overlay open`}
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="modal">
        {title && (
          <>
            <button className="modal-close" onClick={onClose} type="button" aria-label="Zavřít">
              <IconClose />
            </button>
            <h2>{title}</h2>
          </>
        )}
        {children}
      </div>
    </div>
  );
}
