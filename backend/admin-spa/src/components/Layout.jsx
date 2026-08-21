import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const pages = [
  ["Dashboard", "/dashboard"],
  ["Timeline", "/timeline"],
  ["Koncerty", "/concerts"],
  ["Alba", "/albums"],
  ["Novinky", "/news"],
  ["Členové", "/members"],
  ["Fotky", "/photos"],
  ["Videa", "/videos"],
  ["Kontakt", "/contact"],
];

export default function Layout() {
  const { logout } = useAuth();
  return (
    <div className="app">
      <div className="sidebar">
        <div className="brand">SUNIKET</div>
        <nav>
          {pages.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="spacer" />
        <button className="logout" onClick={logout}>
          Odhlásit
        </button>
      </div>
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}
