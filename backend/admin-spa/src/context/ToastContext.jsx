import { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ msg: "", type: "", visible: false });
  const timer = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ msg, type, visible: true });
    timer.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className={`toast ${toast.type} ${toast.visible ? "show" : ""}`}>
        {toast.msg}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
