const API = "/api/admin";

let token = localStorage.getItem("token");

export function setToken(t) {
  token = t;
}

export function getToken() {
  return token;
}

export async function api(path, opts = {}) {
  const headers = {};
  if (opts.body && typeof opts.body === "string")
    headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  if (res.status === 401) {
    token = null;
    localStorage.removeItem("token");
    window.location.hash = "#/login";
    return null;
  }
  return res.json();
}

export async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  try {
    const r = await fetch(`${API}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    return await r.json();
  } catch {
    return null;
  }
}
