import { createContext, useContext, useState, useCallback } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api, setToken, getToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());

  const login = useCallback(async (password) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setToken(data.token);
    setTokenState(data.token);
    localStorage.setItem("token", data.token);
    return true;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
    localStorage.removeItem("token");
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function ProtectedRoute() {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
