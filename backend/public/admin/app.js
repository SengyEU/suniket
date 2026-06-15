const API = "/api/admin";
let token = localStorage.getItem("token");

function api(path, opts = {}) {
  const headers = {};
  if (opts.body && typeof opts.body === "string") headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(`${API}${path}`, { ...opts, headers }).then((r) => {
    if (r.status === 401 && location.hash !== "#/login") {
      token = null;
      localStorage.removeItem("token");
      location.hash = "#/login";
      return null;
    }
    return r.json();
  });
}

async function uploadFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  try {
    const r = await fetch(`${API}/upload`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    return await r.json();
  } catch { return null; }
}

function esc(s) { return String(s).replace(/[<>&"']/g, (c) => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;", "'":"&#39;" })[c]); }

let sortDirs = {};

async function initSortDirs() {
  const dirs = await api("/sort-dir") || {};
  sortDirs = dirs;
}

function sortToggle(section) {
  const cur = sortDirs[section] || "asc";
  const next = cur === "asc" ? "desc" : "asc";
  return `<button class="btn btn-sm btn-edit" onclick="toggleSort('${section}')" title="Změnit řazení">${cur === "asc" ? "↑" : "↓"}</button>`;
}

async function toggleSort(section) {
  const cur = sortDirs[section] || "asc";
  const next = cur === "asc" ? "desc" : "asc";
  await api("/sort-dir", { method: "POST", body: JSON.stringify({ section, dir: next }) });
  sortDirs[section] = next;
  route();
}

function toast(msg, type = "success") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = `toast ${type} show`;
  setTimeout(() => el.classList.remove("show"), 3000);
}

function modal(html) {
  const overlay = document.getElementById("modal");
  document.getElementById("modalContent").innerHTML = html;
  overlay.classList.add("open");
  overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove("open"); };
}

function closeModal() { document.getElementById("modal").classList.remove("open"); }

/* ─── Router ─── */
async function route() {
  const hash = location.hash || "#/dashboard";
  if (!token && hash !== "#/login") { location.hash = "#/login"; return; }
  if (hash !== "#/login") await initSortDirs();
  const m = { "#/login": renderLogin, "#/dashboard": renderDashboard, "#/timeline": () => renderTimeline(), "#/concerts": () => renderConcerts(), "#/albums": () => renderAlbums(),     "#/news": () => renderNews(),     "#/members": () => renderMembers(),     "#/photos": () => renderPhotos(), "#/videos": () => renderTable("videos"), "#/contact": renderContactSettings };
  (m[hash] || renderDashboard)();
}

window.addEventListener("hashchange", route);

/* ─── Login ─── */
function renderLogin() {
  document.getElementById("app").innerHTML = `<div class="login-page"><div class="login-box"><h1>🔑 Suniket Admin</h1><p>Zadej admin heslo</p><input type="password" id="pass" placeholder="Heslo" autofocus><div class="error" id="loginError">Špatné heslo</div><button onclick="doLogin()">Přihlásit se</button></div></div>`;
  document.getElementById("pass").addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });
}

async function doLogin() {
  const pass = document.getElementById("pass").value;
  const err = document.getElementById("loginError");
  const res = await fetch(`${API}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pass }) });
  if (!res.ok) { err.style.display = "block"; return; }
  const data = await res.json();
  token = data.token;
  localStorage.setItem("token", token);
  location.hash = "#/dashboard";
}

function logout() { token = null; localStorage.removeItem("token"); location.hash = "#/login"; }

/* ─── Sidebar ─── */
function shell(content) {
  const pages = [
    ["📊", "Dashboard", "#/dashboard"],
    ["📅", "Timeline", "#/timeline"],
    ["🎸", "Koncerty", "#/concerts"],
    ["💿", "Alba", "#/albums"],
    ["📰", "Novinky", "#/news"],
    ["👤", "Členové", "#/members"],
    ["📷", "Fotky", "#/photos"],
    ["🎬", "Videa", "#/videos"],
    ["📞", "Kontakt", "#/contact"],
  ];
  const hash = location.hash;
  return `<div class="app"><div class="sidebar"><h2><a href="#/dashboard">Suniket</a></h2><nav>${pages.map(([icon, label, h]) => `<a href="${h}" class="${hash === h ? "active" : ""}"><span class="icon">${icon}</span><span>${label}</span></a>`).join("")}</nav><button class="logout" onclick="logout()">🚪 Odhlásit</button></div><div class="main">${content}</div></div>`;
}

/* ─── Dashboard ─── */
async function renderDashboard() {
  const [timeline, concerts, albums, news, members, photos, videos] = await Promise.all([
    api("/timeline"), api("/concerts"), api("/albums"), api("/news"), api("/members"), api("/photos"), api("/videos")
  ]);
  const up = concerts ? concerts.filter((c) => c.is_upcoming).length : 0;
  const pa = concerts ? concerts.length - up : 0;
  document.getElementById("app").innerHTML = shell(`<h1>Dashboard</h1><div class="stats">
    <div class="stat-card"><div class="num">${(timeline||[]).length}</div><div class="label">Timeline</div></div>
    <div class="stat-card"><div class="num">${up}</div><div class="label">Nadcházející koncerty</div></div>
    <div class="stat-card"><div class="num">${pa}</div><div class="label">Proběhlé koncerty</div></div>
    <div class="stat-card"><div class="num">${(albums||[]).length}</div><div class="label">Alba</div></div>
    <div class="stat-card"><div class="num">${(news||[]).length}</div><div class="label">Novinky</div></div>
    <div class="stat-card"><div class="num">${(members||[]).length}</div><div class="label">Členové</div></div>
    <div class="stat-card"><div class="num">${(photos||[]).length}</div><div class="label">Fotky</div></div>
    <div class="stat-card"><div class="num">${(videos||[]).length}</div><div class="label">Videa</div></div>
  </div>`);
}

/* ─── Contact Settings ─── */
async function renderContactSettings() {
  const data = await api("/contact-settings") || {};
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
  const vals = {};
  for (const [k] of fields) vals[k] = data[k] || "";
  for (const [k] of dlFields) vals[k] = data[k] || "";

  document.getElementById("app").innerHTML = shell(`
    <div class="table-wrap">
      <div class="toolbar"><h2>Nastavení kontaktu</h2></div>
      <div style="padding:20px">
        <form id="contact-form">
          <h3 style="font-size:15px;color:var(--accent);margin-bottom:16px;font-weight:600">Kontaktní údaje</h3>
          ${fields.map(([k, label, type]) =>
            `<div class="form-group"><label>${label}</label><input type="${type}" id="${k}" value="${esc(vals[k])}"></div>`
          ).join("")}
          <hr style="border:none;border-top:1px solid var(--border);margin:24px 0">
          <h3 style="font-size:15px;color:var(--accent);margin-bottom:16px;font-weight:600">Ke stažení</h3>
          ${dlFields.map(([k, label, type]) =>
            `<div class="form-group"><label>${label}</label><input type="${type}" id="${k}" value="${esc(vals[k])}"></div>`
          ).join("")}
          <div style="display:flex;gap:8px;margin-top:24px">
            <button type="submit" class="btn btn-primary" id="contactSaveBtn">Uložit</button>
          </div>
        </form>
        <div id="contact-msg" style="margin-top:12px"></div>
      </div>
    </div>
  `);
  document.getElementById("contact-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("contactSaveBtn"); btn.disabled = true; btn.textContent = "Ukládám...";
    const body = {};
    for (const [k] of fields) body[k] = document.getElementById(k).value;
    for (const [k] of dlFields) body[k] = document.getElementById(k).value;
    const res = await api("/contact-settings", { method: "POST", body: JSON.stringify(body) });
    btn.disabled = false; btn.textContent = "Uložit";
    const msg = document.getElementById("contact-msg");
    msg.innerHTML = res.success
      ? '<p style="color:#2d6a4f;font-size:13px">✅ Nastavení uloženo</p>'
      : '<p style="color:var(--accent);font-size:13px">❌ Chyba při ukládání</p>';
    setTimeout(() => { msg.innerHTML = ""; }, 3000);
  });
}

/* ─── Generic Table ─── */
const tableConfig = {
  videos: {
    title: "Videa", fields: [
      { key: "youtube_id", label: "YouTube ID", type: "text" },
      { key: "sort_order", label: "Pořadí", type: "number" },
    ], cols: ["youtube_id", "sort_order"],
    row: (r) => [r.youtube_id, r.sort_order]
  }
};

async function renderTable(section) {
  const cfg = tableConfig[section];
  const data = await api(`/${section}`) || [];
  document.getElementById("app").innerHTML = shell(`<div class="table-wrap"><div class="toolbar"><h2>${cfg.title}</h2><div class="toolbar-actions">${sortToggle(section)}<button class="btn btn-primary" onclick="openAdd('${section}')">+ Přidat</button></div></div>
    <table><thead><tr>${cfg.cols.map((c) => `<th>${cfg.fields.find((f) => f.key === c).label}</th>`).join("")}<th></th></tr></thead>
    <tbody>${data.length ? data.map((r) => `<tr>${cfg.row(r).map((c) => `<td>${c ?? ""}</td>`).join("")}<td class="actions"><button class="btn btn-sm btn-edit" onclick="openEdit('${section}',${r.id})">✏️ Upravit</button> <button class="btn btn-sm btn-del" onclick="delItem('${section}',${r.id})">🗑️</button></td></tr>`).join("") : `<tr><td colspan="${cfg.cols.length+1}" class="empty">Žádné záznamy</td></tr>`}</tbody></table></div>`);
}

window.openAdd = (section) => {
  const cfg = tableConfig[section];
  modal(`<h2>Přidat — ${cfg.title}</h2><form id="form">${cfg.fields.map((f) => f.type === "textarea" ? `<div class="form-group"><label>${f.label}</label><textarea name="${f.key}"></textarea></div>` : `<div class="form-group"><label>${f.label}</label><input type="${f.type}" name="${f.key}"></div>`).join("")}<div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary">Uložit</button></div></form>`);
  document.getElementById("form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {};
    cfg.fields.forEach((f) => { const v = fd.get(f.key); if (v) body[f.key] = f.type === "number" ? Number(v) : v; });
    await api(`/${section}`, { method: "POST", body: JSON.stringify(body) });
    closeModal(); toast("Přidáno"); renderTable(section);
  };
};

window.openEdit = (section, id) => {
  const cfg = tableConfig[section];
  api(`/${section}`).then((data) => {
    const item = data.find((r) => r.id === id);
    if (!item) return;
    modal(`<h2>Upravit — ${cfg.title}</h2><form id="form">${cfg.fields.map((f) => f.type === "textarea" ? `<div class="form-group"><label>${f.label}</label><textarea name="${f.key}">${item[f.key] ?? ""}</textarea></div>` : `<div class="form-group"><label>${f.label}</label><input type="${f.type}" name="${f.key}" value="${String(item[f.key] ?? "").replace(/"/g,"&quot;")}"></div>`).join("")}<div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary">Uložit</button></div></form>`);
    document.getElementById("form").onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const body = {};
      cfg.fields.forEach((f) => { const v = fd.get(f.key); body[f.key] = f.type === "number" ? Number(v) : v; });
      await api(`/${section}/${id}`, { method: "PUT", body: JSON.stringify(body) });
      closeModal(); toast("Uloženo"); renderTable(section);
    };
  });
};

window.delItem = async (section, id) => {
  if (!confirm("Opravdu smazat?")) return;
  await api(`/${section}/${id}`, { method: "DELETE" });
  toast("Smazáno"); renderTable(section);
};

/* ─── Concerts (special: is_upcoming) ─── */
const concertFields = [
  { key: "date", label: "Datum", type: "text" },
  { key: "event", label: "Událost", type: "text" },
  { key: "link", label: "Odkaz", type: "text" },
  { key: "place", label: "Místo", type: "text" },
  { key: "time", label: "Čas", type: "text" },
  { key: "entry", label: "Vstupné (checkbox)", type: "checkbox" },
  { key: "entry_has_link", label: "Vstupné s odkazem", type: "checkbox" },
  { key: "entry_price", label: "Cena", type: "text" },
  { key: "entry_link", label: "Odkaz na vstupenky", type: "text" },
  { key: "is_upcoming", label: "Nadcházející", type: "checkbox" },
  { key: "sort_order", label: "Pořadí", type: "number" },
];

async function renderConcerts() {
  const data = await api("/concerts") || [];
  const upcoming = data.filter((r) => r.is_upcoming);
  const past = data.filter((r) => !r.is_upcoming);
  document.getElementById("app").innerHTML = shell(`<div class="table-wrap"><div class="toolbar"><h2>Koncerty</h2><div class="toolbar-actions">${sortToggle("concerts")}<button class="btn btn-primary" onclick="openConcertAdd()">+ Přidat</button></div></div>
    <table><thead><tr><th>Datum</th><th>Událost</th><th>Místo</th><th>Čas</th><th>Typ</th><th></th></tr></thead>
    <tbody>${data.length ? data.map((r) => `<tr><td>${r.date}</td><td>${r.event}</td><td>${r.place}</td><td>${r.time ?? "—"}</td><td>${r.is_upcoming ? "🔜 Nadcházející" : "✅ Proběhlé"}</td><td class="actions"><button class="btn btn-sm btn-edit" onclick="openConcertEdit(${r.id})">✏️</button> <button class="btn btn-sm btn-del" onclick="delConcert(${r.id})">🗑️</button></td></tr>`).join("") : `<tr><td colspan="6" class="empty">Žádné koncerty</td></tr>`}</tbody></table></div>`);
}

function concertForm(item) {
  return concertFields.map((f) => {
    const val = item ? item[f.key] : (f.type === "checkbox" ? false : "");
    if (f.type === "checkbox") return `<div class="form-group checkbox"><input type="checkbox" name="${f.key}" ${val ? "checked" : ""}><label>${f.label}</label></div>`;
    if (f.type === "textarea") return `<div class="form-group"><label>${f.label}</label><textarea name="${f.key}">${val}</textarea></div>`;
    return `<div class="form-group"><label>${f.label}</label><input type="${f.type}" name="${f.key}" value="${String(val).replace(/"/g,"&quot;")}"></div>`;
  }).join("");
}

window.openConcertAdd = () => {
  modal(`<h2>Přidat koncert</h2><form id="form">${concertForm()}<div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary">Uložit</button></div></form>`);
  document.getElementById("form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = {};
    concertFields.forEach((f) => {
      if (f.type === "checkbox") body[f.key] = fd.has(f.key) ? 1 : 0;
      else { const v = fd.get(f.key); body[f.key] = f.type === "number" ? Number(v) : v; }
    });
    await api("/concerts", { method: "POST", body: JSON.stringify(body) });
    closeModal(); toast("Přidáno"); renderConcerts();
  };
};

window.openConcertEdit = (id) => {
  api("/concerts").then((data) => {
    const item = data.find((r) => r.id === id);
    if (!item) return;
    modal(`<h2>Upravit koncert</h2><form id="form">${concertForm(item)}<div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary">Uložit</button></div></form>`);
    document.getElementById("form").onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const body = {};
      concertFields.forEach((f) => {
        if (f.type === "checkbox") body[f.key] = fd.has(f.key) ? 1 : 0;
        else { const v = fd.get(f.key); body[f.key] = f.type === "number" ? Number(v) : v; }
      });
      await api(`/concerts/${id}`, { method: "PUT", body: JSON.stringify(body) });
      closeModal(); toast("Uloženo"); renderConcerts();
    };
  });
};

window.delConcert = async (id) => {
  if (!confirm("Opravdu smazat?")) return;
  await api(`/concerts/${id}`, { method: "DELETE" });
  toast("Smazáno"); renderConcerts();
};

/* ─── Albums (nested songs + lyrics) ─── */
async function renderAlbums() {
  const [albums, songs, lyrics] = await Promise.all([api("/albums") || [], api("/songs") || [], api("/lyrics") || []]);
  const lyricsBySong = {};
  (lyrics||[]).forEach((l) => { if (!lyricsBySong[l.song_id]) lyricsBySong[l.song_id] = []; lyricsBySong[l.song_id].push(l); });
  const songsByAlbum = {};
  (songs||[]).forEach((s) => { if (!songsByAlbum[s.album_id]) songsByAlbum[s.album_id] = []; songsByAlbum[s.album_id].push(s); });
  document.getElementById("app").innerHTML = shell(`<div class="table-wrap"><div class="toolbar"><h2>Alba</h2><div class="toolbar-actions">${sortToggle("albums")}<button class="btn btn-primary" onclick="openAlbumAdd()">+ Přidat album</button></div></div>
    <table><thead><tr><th>Název</th><th>Cover</th><th>Skladby</th><th></th></tr></thead>
    <tbody>${(albums||[]).length ? (albums||[]).map((a) => `<tr><td><strong>${a.title}</strong></td><td>${a.cover ? `<img src="${a.cover}" style="width:60px;height:40px;object-fit:cover;border-radius:4px">` : "—"}</td>
    <td><ul class="song-list">${(songsByAlbum[a.id]||[]).map((s) => `<li><span><strong>${s.title}</strong>${(lyricsBySong[s.id]||[]).length ? `<div class="lyrics-preview">${(lyricsBySong[s.id]||[]).slice(0,3).map((l) => l.line).join(" / ")}${(lyricsBySong[s.id]||[]).length > 3 ? "…" : ""}</div>` : ""}</span><span class="mini-actions"><button class="btn btn-icon" onclick="openSongEdit(${s.id})" title="Upravit skladbu">✏️</button><button class="btn btn-icon" onclick="openLyricsEdit(${s.id})" title="Upravit text">📝</button><button class="btn btn-icon" onclick="delSong(${s.id})" title="Smazat" style="color:var(--accent)">🗑️</button></span></li>`).join("")}
    <li><button class="btn btn-sm btn-edit" onclick="openSongAdd(${a.id})" style="width:100%">+ Přidat skladbu</button></li></ul></td>
    <td class="actions"><button class="btn btn-sm btn-edit" onclick="openAlbumEdit(${a.id})">✏️</button> <button class="btn btn-sm btn-del" onclick="delAlbum(${a.id})">🗑️</button></td></tr>`).join("") : `<tr><td colspan="4" class="empty">Žádná alba</td></tr>`}</tbody></table></div>`);
}

/* Album CRUD */
const albumFields = [
  { key: "title", label: "Název alba", type: "text" },
  { key: "description", label: "Popis", type: "textarea" },
  { key: "link_text", label: "Text odkazu (např. Bandzone, Spotify)", type: "text" },
  { key: "link", label: "URL odkazu", type: "text" },
  { key: "sort_order", label: "Pořadí", type: "number" },
];

window.openAlbumAdd = () => {
  window._ac = "";
  modal(`<h2>Přidat album</h2><form id="form">
    <div class="form-group"><label>Cover obrázek</label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="file" id="albumCoverFile" name="coverFile" accept="image/*" style="flex:1" onchange="document.getElementById('albumCoverLabel').textContent=this.files[0]?.name||''">
        <button type="button" class="btn btn-sm btn-edit" onclick="openGalleryPicker((src)=>{document.getElementById('albumCoverPreview').src=src;document.getElementById('albumCoverPreview').style.display='block';document.getElementById('albumCoverLabel').textContent=src;window._ac=src})">🖼 Z galerie</button>
      </div>
      <span id="albumCoverLabel" style="font-size:12px;color:var(--text2)"></span>
      <img id="albumCoverPreview" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px;display:none">
    </div>
    ${albumFields.map((f) => f.type === "textarea" ? `<div class="form-group"><label>${f.label}</label><textarea name="${f.key}"></textarea></div>` : `<div class="form-group"><label>${f.label}</label><input type="${f.type}" name="${f.key}"></div>`).join("")}
    <div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary" id="saveBtn">Uložit</button></div></form>`);
  document.getElementById("form").onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("saveBtn"); btn.disabled = true; btn.textContent = "Nahrávám...";
    const fd = new FormData(e.target);
    let cover = "";
    if (e.target.coverFile.files[0]) {
      const up = await uploadFile(e.target.coverFile.files[0]);
      if (up?.src) cover = up.src;
    } else if (window._ac) {
      cover = window._ac;
    }
    window._ac = null;
    const body = {};
    albumFields.forEach((f) => { const v = fd.get(f.key); if (v) body[f.key] = f.type === "number" ? Number(v) : v; });
    if (cover) body.cover = cover;
    await api("/albums", { method: "POST", body: JSON.stringify(body) });
    closeModal(); toast("Album přidáno"); renderAlbums();
  };
};

window.openAlbumEdit = (id) => {
  api("/albums").then((data) => {
    const item = data.find((r) => r.id === id);
    if (!item) return;
    window._ac = item.cover || "";
    modal(`<h2>Upravit album</h2><form id="form">
      <div class="form-group"><label>Cover obrázek (nechat prázdné = ponechat stávající)</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="file" id="albumCoverFile" name="coverFile" accept="image/*" style="flex:1" onchange="document.getElementById('albumCoverLabel').textContent=this.files[0]?.name||''">
          <button type="button" class="btn btn-sm btn-edit" onclick="openGalleryPicker((src)=>{document.getElementById('albumCoverPreview').src=src;document.getElementById('albumCoverPreview').style.display='block';document.getElementById('albumCoverLabel').textContent=src;window._ac=src})">🖼 Z galerie</button>
        </div>
        <span id="albumCoverLabel" style="font-size:12px;color:var(--text2)">${item.cover ? item.cover : ""}</span>
        ${item.cover ? `<img id="albumCoverPreview" src="${item.cover}" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px">` : `<img id="albumCoverPreview" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px;display:none">`}
      </div>
      ${albumFields.map((f) => f.type === "textarea" ? `<div class="form-group"><label>${f.label}</label><textarea name="${f.key}">${item[f.key] ?? ""}</textarea></div>` : `<div class="form-group"><label>${f.label}</label><input type="${f.type}" name="${f.key}" value="${String(item[f.key] ?? "").replace(/"/g,"&quot;")}"></div>`).join("")}
      <div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary" id="saveBtn">Uložit</button></div></form>`);
    document.getElementById("form").onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById("saveBtn"); btn.disabled = true; btn.textContent = "Ukládám...";
      const fd = new FormData(e.target);
      let cover = item.cover;
      if (e.target.coverFile.files[0]) {
        const up = await uploadFile(e.target.coverFile.files[0]);
        if (up?.src) cover = up.src;
      } else if (window._ac && window._ac !== item.cover) {
        cover = window._ac;
      }
      window._ac = null;
      const body = {};
      albumFields.forEach((f) => { const v = fd.get(f.key); body[f.key] = f.type === "number" ? Number(v) : v; });
      body.cover = cover;
      await api(`/albums/${id}`, { method: "PUT", body: JSON.stringify(body) });
      closeModal(); toast("Album uloženo"); renderAlbums();
    };
  });
};

window.delAlbum = async (id) => {
  if (!confirm("Opravdu smazat album i se všemi skladbami?")) return;
  await api(`/albums/${id}`, { method: "DELETE" });
  toast("Album smazáno"); renderAlbums();
};

/* Song CRUD */
window.openSongAdd = (albumId) => {
  modal(`<h2>Přidat skladbu</h2><form id="form"><div class="form-group"><label>Název skladby</label><input type="text" name="title"></div><div class="form-group"><label>Pořadí</label><input type="number" name="sort_order" value="0"></div><div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary">Uložit</button></div></form>`);
  document.getElementById("form").onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const body = { album_id: albumId, title: fd.get("title"), sort_order: Number(fd.get("sort_order") || 0) };
    await api("/songs", { method: "POST", body: JSON.stringify(body) });
    closeModal(); toast("Skladba přidána"); renderAlbums();
  };
};

window.openSongEdit = (id) => {
  api("/songs").then((data) => {
    const item = data.find((r) => r.id === id);
    if (!item) return;
    modal(`<h2>Upravit skladbu</h2><form id="form"><div class="form-group"><label>Název</label><input type="text" name="title" value="${item.title.replace(/"/g,"&quot;")}"></div><div class="form-group"><label>Pořadí</label><input type="number" name="sort_order" value="${item.sort_order}"></div><div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary">Uložit</button></div></form>`);
    document.getElementById("form").onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const body = { title: fd.get("title"), sort_order: Number(fd.get("sort_order") || 0) };
      await api(`/songs/${id}`, { method: "PUT", body: JSON.stringify(body) });
      closeModal(); toast("Skladba uložena"); renderAlbums();
    };
  });
};

window.delSong = async (id) => {
  if (!confirm("Smazat skladbu?")) return;
  await api(`/songs/${id}`, { method: "DELETE" });
  toast("Skladba smazána"); renderAlbums();
};

/* Lyrics CRUD */
window.openLyricsEdit = (songId) => {
  api(`/lyrics?song_id=${songId}`).then((lyrics) => {
    const lines = (lyrics||[]).sort((a, b) => a.line_order - b.line_order).map((l) => l.line);
    const text = lines.join("\n");
    modal(`<h2>Upravit text skladby</h2><p class="hint" style="margin-bottom:16px;font-size:13px;color:var(--text2)">Každý řádek zvlášť. Prázdné řádky budou odstraněny.</p><form id="form"><div class="form-group"><textarea name="text" rows="15" style="font-family:inherit;white-space:pre">${text.replace(/"/g,"&quot;")}</textarea></div><div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary">Uložit</button></div></form>`);
    document.getElementById("form").onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const raw = fd.get("text") || "";
      const newLines = raw.split("\n");
      for (const l of lyrics||[]) {
        await api(`/lyrics/${l.id}`, { method: "DELETE" });
      }
      for (let i = 0; i < newLines.length; i++) {
        await api("/lyrics", { method: "POST", body: JSON.stringify({ song_id: songId, line: newLines[i], line_order: i }) });
      }
      closeModal(); toast("Text uložen"); renderAlbums();
    };
  });
};

/* ─── Timeline (with gallery picker + upload) ─── */
const timelineFields = [
  { key: "year", label: "Rok", type: "text" },
  { key: "text", label: "Text", type: "textarea" },
  { key: "alt", label: "Alt text", type: "text" },
  { key: "sort_order", label: "Pořadí", type: "number" },
];

async function renderTimeline() {
  const data = await api("/timeline") || [];
  document.getElementById("app").innerHTML = shell(`<div class="table-wrap"><div class="toolbar"><h2>Timeline (O kapele)</h2><div class="toolbar-actions">${sortToggle("timeline")}<button class="btn btn-primary" onclick="openTimelineAdd()">+ Přidat</button></div></div>
    <table><thead><tr><th>Rok</th><th>Text</th><th>Obrázek</th><th>Pořadí</th><th></th></tr></thead>
    <tbody>${data.length ? data.map((r) => `<tr><td>${r.year||""}</td><td>${(r.text||"").slice(0,60)+(r.text?.length>60?"…":"")}</td><td>${r.img ? `<img src="${r.img}" style="width:60px;height:40px;object-fit:cover;border-radius:4px">` : "—"}</td><td>${r.sort_order}</td><td class="actions"><button class="btn btn-sm btn-edit" onclick="openTimelineEdit(${r.id})">✏️</button> <button class="btn btn-sm btn-del" onclick="delItem('timeline',${r.id})">🗑️</button></td></tr>`).join("") : `<tr><td colspan="5" class="empty">Žádné záznamy</td></tr>`}</tbody></table></div>`);
}

function galleryModal(html) {
  const overlay = document.getElementById("galleryModal");
  document.getElementById("galleryContent").innerHTML = html;
  overlay.classList.add("open");
  overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove("open"); };
}

function closeGalleryModal() { document.getElementById("galleryModal").classList.remove("open"); }

async function openGalleryPicker(callback) {
  const photos = await api("/photos") || [];
  galleryModal(`<h2>Vybrat fotku z galerie</h2><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;max-height:60vh;overflow-y:auto;padding:4px">${photos.length ? photos.map((p) => `<div class="gallery-item" onclick="pickGalleryItem('${p.src.replace(/'/g,"\\'")}')" style="cursor:pointer;border:2px solid transparent;border-radius:6px;overflow:hidden;transition:border-color .15s" onmouseover="this.style.borderColor='var(--accent)'" onmouseout="this.style.borderColor='transparent'"><img src="${p.src}" alt="${p.alt||''}" style="width:100%;height:80px;object-fit:cover;display:block"></div>`).join("") : '<p style="color:var(--text2)">Žádné fotky v galerii</p>'}</div><div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeGalleryModal()">Zrušit</button></div>`);
  window.pickGalleryItem = (src) => {
    closeGalleryModal();
    callback(src);
  };
}

window.openTimelineAdd = () => {
  window._tli = "";
  modal(`<h2>Přidat do timeline</h2><form id="form">
    <div class="form-group"><label>Rok</label><input type="text" name="year"></div>
    <div class="form-group"><label>Text</label><textarea name="text"></textarea></div>
    <div class="form-group"><label>Obrázek</label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="file" id="timelineFile" name="file" accept="image/*" style="flex:1" onchange="document.getElementById('timelineImgLabel').textContent=this.files[0]?.name||'vybrán soubor'">
        <button type="button" class="btn btn-sm btn-edit" onclick="openGalleryPicker((src)=>{document.getElementById('timelineImgPreview').src=src;document.getElementById('timelineImgPreview').style.display='block';document.getElementById('timelineImgLabel').textContent=src;window._tli=src})">🖼 Z galerie</button>
      </div>
      <span id="timelineImgLabel" style="font-size:12px;color:var(--text2)"></span>
      <img id="timelineImgPreview" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px;display:none">
    </div>
    <div class="form-group"><label>Alt text</label><input type="text" name="alt"></div>
    <div class="form-group"><label>Pořadí</label><input type="number" name="sort_order" value="0"></div>
    <input type="hidden" id="timelineImgHidden" name="img" value="">
    <div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary" id="saveBtn">Uložit</button></div></form>`);
  document.getElementById("form").onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("saveBtn"); btn.disabled = true; btn.textContent = "Nahrávám...";
    const fd = new FormData(e.target);
    let img = "";
    if (e.target.file.files[0]) {
      const up = await uploadFile(e.target.file.files[0]);
      if (up?.src) img = up.src;
    } else if (window._tli) {
      img = window._tli;
    }
    window._tli = null;
    const body = { year: fd.get("year"), text: fd.get("text"), alt: fd.get("alt") || "", sort_order: Number(fd.get("sort_order") || 0) };
    if (img) body.img = img;
    await api("/timeline", { method: "POST", body: JSON.stringify(body) });
    closeModal(); toast("Přidáno"); renderTimeline();
  };
};

window.openTimelineEdit = (id) => {
  api("/timeline").then((data) => {
    const item = data.find((r) => r.id === id);
    if (!item) return;
    window._tli = item.img || "";
    modal(`<h2>Upravit položku timeline</h2><form id="form">
      <div class="form-group"><label>Rok</label><input type="text" name="year" value="${(item.year||"").replace(/"/g,"&quot;")}"></div>
      <div class="form-group"><label>Text</label><textarea name="text">${(item.text||"").replace(/"/g,"&quot;")}</textarea></div>
      <div class="form-group"><label>Obrázek (nechat prázdné = ponechat stávající)</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="file" id="timelineFile" name="file" accept="image/*" style="flex:1" onchange="document.getElementById('timelineImgLabel').textContent=this.files[0]?.name||'vybrán soubor'">
          <button type="button" class="btn btn-sm btn-edit" onclick="openGalleryPicker((src)=>{document.getElementById('timelineImgPreview').src=src;document.getElementById('timelineImgPreview').style.display='block';document.getElementById('timelineImgLabel').textContent=src;window._tli=src})">🖼 Z galerie</button>
        </div>
        <span id="timelineImgLabel" style="font-size:12px;color:var(--text2)">${item.img ? item.img : ""}</span>
        ${item.img ? `<img id="timelineImgPreview" src="${item.img}" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px">` : `<img id="timelineImgPreview" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px;display:none">`}
      </div>
      <div class="form-group"><label>Alt text</label><input type="text" name="alt" value="${(item.alt||"").replace(/"/g,"&quot;")}"></div>
      <div class="form-group"><label>Pořadí</label><input type="number" name="sort_order" value="${item.sort_order}"></div>
      <input type="hidden" id="timelineImgHidden" name="img" value="">
      <div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary" id="saveBtn">Uložit</button></div></form>`);
    document.getElementById("form").onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById("saveBtn"); btn.disabled = true; btn.textContent = "Ukládám...";
      const fd = new FormData(e.target);
      let img = item.img;
      if (e.target.file.files[0]) {
        const up = await uploadFile(e.target.file.files[0]);
        if (up?.src) img = up.src;
      } else if (window._tli && window._tli !== item.img) {
        img = window._tli;
      }
      window._tli = null;
      const body = { year: fd.get("year"), text: fd.get("text"), alt: fd.get("alt") || "", sort_order: Number(fd.get("sort_order") || 0) };
      body.img = img || "";
      await api(`/timeline/${id}`, { method: "PUT", body: JSON.stringify(body) });
      closeModal(); toast("Uloženo"); renderTimeline();
    };
  });
};

/* ─── News (with upload) ─── */
const newsFields = [
  { key: "date", label: "Datum", type: "text" },
  { key: "title", label: "Název", type: "text" },
  { key: "description", label: "Popis", type: "textarea" },
  { key: "link", label: "Odkaz", type: "text" },
  { key: "link_text", label: "Text odkazu", type: "text" },
  { key: "sort_order", label: "Pořadí", type: "number" },
];

async function renderNews() {
  const data = await api("/news") || [];
  document.getElementById("app").innerHTML = shell(`<div class="table-wrap"><div class="toolbar"><h2>Novinky</h2><div class="toolbar-actions">${sortToggle("news")}<button class="btn btn-primary" onclick="openNewsAdd()">+ Přidat</button></div></div>
    <table><thead><tr><th>Datum</th><th>Název</th><th>Obrázek</th><th>Odkaz</th><th></th></tr></thead>
    <tbody>${data.length ? data.map((r) => `<tr><td>${r.date||""}</td><td>${(r.title||"").slice(0,50)+(r.title?.length>50?"…":"")}</td><td>${r.image ? `<img src="${r.image}" style="width:60px;height:40px;object-fit:cover;border-radius:4px">` : "—"}</td><td>${r.link ? `<a href="${r.link}" target="_blank">🔗</a>` : "—"}</td><td class="actions"><button class="btn btn-sm btn-edit" onclick="openNewsEdit(${r.id})">✏️</button> <button class="btn btn-sm btn-del" onclick="delItem('news',${r.id})">🗑️</button></td></tr>`).join("") : `<tr><td colspan="5" class="empty">Žádné novinky</td></tr>`}</tbody></table></div>`);
}

window.openNewsAdd = () => {
  window._ni = "";
  modal(`<h2>Přidat novinku</h2><form id="form">
    <div class="form-group"><label>Obrázek</label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="file" id="newsImageFile" name="imageFile" accept="image/*" style="flex:1" onchange="document.getElementById('newsImageLabel').textContent=this.files[0]?.name||''">
        <button type="button" class="btn btn-sm btn-edit" onclick="openGalleryPicker((src)=>{document.getElementById('newsImagePreview').src=src;document.getElementById('newsImagePreview').style.display='block';document.getElementById('newsImageLabel').textContent=src;window._ni=src})">🖼 Z galerie</button>
      </div>
      <span id="newsImageLabel" style="font-size:12px;color:var(--text2)"></span>
      <img id="newsImagePreview" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px;display:none">
    </div>
    ${newsFields.map((f) => f.type === "textarea" ? `<div class="form-group"><label>${f.label}</label><textarea name="${f.key}"></textarea></div>` : `<div class="form-group"><label>${f.label}</label><input type="${f.type}" name="${f.key}"></div>`).join("")}
    <div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary" id="saveBtn">Uložit</button></div></form>`);
  document.getElementById("form").onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("saveBtn"); btn.disabled = true; btn.textContent = "Nahrávám...";
    const fd = new FormData(e.target);
    let image = "";
    if (e.target.imageFile.files[0]) {
      const up = await uploadFile(e.target.imageFile.files[0]);
      if (up?.src) image = up.src;
    } else if (window._ni) {
      image = window._ni;
    }
    window._ni = null;
    const body = {};
    newsFields.forEach((f) => { const v = fd.get(f.key); if (v) body[f.key] = f.type === "number" ? Number(v) : v; });
    if (image) body.image = image;
    await api("/news", { method: "POST", body: JSON.stringify(body) });
    closeModal(); toast("Přidáno"); renderNews();
  };
};

window.openNewsEdit = (id) => {
  api("/news").then((data) => {
    const item = data.find((r) => r.id === id);
    if (!item) return;
    window._ni = item.image || "";
    modal(`<h2>Upravit novinku</h2><form id="form">
      <div class="form-group"><label>Obrázek (nechat prázdné = ponechat stávající)</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="file" id="newsImageFile" name="imageFile" accept="image/*" style="flex:1" onchange="document.getElementById('newsImageLabel').textContent=this.files[0]?.name||''">
          <button type="button" class="btn btn-sm btn-edit" onclick="openGalleryPicker((src)=>{document.getElementById('newsImagePreview').src=src;document.getElementById('newsImagePreview').style.display='block';document.getElementById('newsImageLabel').textContent=src;window._ni=src})">🖼 Z galerie</button>
        </div>
        <span id="newsImageLabel" style="font-size:12px;color:var(--text2)">${item.image ? item.image : ""}</span>
        ${item.image ? `<img id="newsImagePreview" src="${item.image}" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px">` : `<img id="newsImagePreview" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px;display:none">`}
      </div>
      ${newsFields.map((f) => f.type === "textarea" ? `<div class="form-group"><label>${f.label}</label><textarea name="${f.key}">${item[f.key] ?? ""}</textarea></div>` : `<div class="form-group"><label>${f.label}</label><input type="${f.type}" name="${f.key}" value="${String(item[f.key] ?? "").replace(/"/g,"&quot;")}"></div>`).join("")}
      <div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary" id="saveBtn">Uložit</button></div></form>`);
    document.getElementById("form").onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById("saveBtn"); btn.disabled = true; btn.textContent = "Ukládám...";
      const fd = new FormData(e.target);
      let image = item.image;
      if (e.target.imageFile.files[0]) {
        const up = await uploadFile(e.target.imageFile.files[0]);
        if (up?.src) image = up.src;
      } else if (window._ni && window._ni !== item.image) {
        image = window._ni;
      }
      window._ni = null;
      const body = {};
      newsFields.forEach((f) => { const v = fd.get(f.key); body[f.key] = f.type === "number" ? Number(v) : v; });
      body.image = image;
      await api(`/news/${id}`, { method: "PUT", body: JSON.stringify(body) });
      closeModal(); toast("Uloženo"); renderNews();
    };
  });
};

/* ─── Photos (with upload) ─── */
async function renderPhotos() {
  const data = await api("/photos") || [];
  document.getElementById("app").innerHTML = shell(`<div class="table-wrap"><div class="toolbar"><h2>Fotky</h2><div class="toolbar-actions">${sortToggle("photos")}<button class="btn btn-sm btn-edit" onclick="openPhotoMassUpload()" style="border:1px solid var(--accent)">📥 Hromadné nahrávání</button><button class="btn btn-primary" onclick="openPhotoAdd()">+ Přidat</button></div></div>
    <table><thead><tr><th>Náhled</th><th>Cesta</th><th>Alt text</th><th></th></tr></thead>
    <tbody>${data.length ? data.map((r) => `<tr><td><img src="${r.thumb || r.src}" alt="${r.alt}" style="width:60px;height:40px;object-fit:cover;border-radius:4px"></td><td>${(r.src||"").slice(0,30)}…</td><td>${r.alt||""}</td><td class="actions"><button class="btn btn-sm btn-edit" onclick="openPhotoEdit(${r.id})">✏️</button> <button class="btn btn-sm btn-del" onclick="delItem('photos',${r.id})">🗑️</button></td></tr>`).join("") : `<tr><td colspan="4" class="empty">Žádné fotky</td></tr>`}</tbody></table></div>`);
}

window.openPhotoAdd = () => {
  modal(`<h2>Přidat fotku</h2><form id="form"><div class="form-group"><label>Soubor (JPG/PNG)</label><input type="file" name="file" accept="image/*"></div><div class="form-group"><label>Alt text</label><input type="text" name="alt"></div><div class="form-group"><label>Pořadí</label><input type="number" name="sort_order" value="0"></div><div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary" id="saveBtn">Uložit</button></div></form>`);
  document.getElementById("form").onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("saveBtn"); btn.disabled = true; btn.textContent = "Nahrávám...";
    const file = e.target.file.files[0];
    if (!file) { toast("Vyber soubor", "error"); btn.disabled = false; btn.textContent = "Uložit"; return; }
    const up = await uploadFile(file);
    if (!up?.src) { toast("Nahrávání selhalo", "error"); btn.disabled = false; btn.textContent = "Uložit"; return; }
    const fd = new FormData(e.target);
    const body = { src: up.src, alt: fd.get("alt") || "", sort_order: Number(fd.get("sort_order") || 0) };
    await api("/photos", { method: "POST", body: JSON.stringify(body) });
    closeModal(); toast("Fotka přidána"); renderPhotos();
  };
};

window.openPhotoMassUpload = () => {
  modal(`<h2>Hromadné nahrávání fotek</h2><form id="massUploadForm"><div class="form-group"><label>Vyberte fotky (lze vybrat více najednou)</label><input type="file" name="files" multiple accept="image/*"></div><div class="form-group"><label>Alt text (platí pro všechny fotky)</label><input type="text" name="alt" value="" placeholder="nepovinné"></div><div id="massUploadProgress" style="margin-bottom:12px;font-size:13px"></div><div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary" id="massUploadBtn">Nahrát</button></div></form>`);
  document.getElementById("massUploadForm").onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("massUploadBtn");
    const progress = document.getElementById("massUploadProgress");
    const files = e.target.files.files;
    if (!files || !files.length) { toast("Vyber soubory", "error"); return; }
    btn.disabled = true; btn.textContent = "Nahrávám...";
      let ok = 0, fail = 0;
    for (let i = 0; i < files.length; i++) {
      progress.innerHTML = `Nahrávám ${i + 1}/${files.length}...`;
      const up = await uploadFile(files[i]);
      if (up?.src) {
        await api("/photos", { method: "POST", body: JSON.stringify({ src: up.src, alt: document.getElementById("massUploadForm").alt.value.trim() }) });
        ok++;
      } else {
        fail++;
      }
    }
    progress.innerHTML = ok ? `<span style="color:#2d6a4f">✅ Nahráno ${ok} fotek</span>` : "";
    if (fail) progress.innerHTML += `<span style="color:var(--accent);margin-left:8px">❌ ${fail} selhalo</span>`;
    btn.textContent = "Hotovo";
    setTimeout(() => { closeModal(); renderPhotos(); }, 1500);
  };
};

window.openPhotoEdit = (id) => {
  api("/photos").then((data) => {
    const item = data.find((r) => r.id === id);
    if (!item) return;
    modal(`<h2>Upravit fotku</h2><form id="form"><div class="form-group"><label>Soubor (nechat prázdné = ponechat stávající)</label><input type="file" name="file" accept="image/*"></div>
    <div style="margin-bottom:12px">${item.src ? `<img src="${item.src}" style="max-width:200px;max-height:120px;border-radius:4px">` : ""}</div>
    <div class="form-group"><label>Alt text</label><input type="text" name="alt" value="${String(item.alt||"").replace(/"/g,"&quot;")}"></div>
    <div class="form-group"><label>Pořadí</label><input type="number" name="sort_order" value="${item.sort_order}"></div>
    <div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary" id="saveBtn">Uložit</button></div></form>`);
    document.getElementById("form").onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById("saveBtn"); btn.disabled = true; btn.textContent = "Ukládám...";
      const fd = new FormData(e.target);
      let src = item.src;
      if (e.target.file.files[0]) {
        const up = await uploadFile(e.target.file.files[0]);
        if (up?.src) src = up.src;
      }
      const body = { src, alt: fd.get("alt") || "", sort_order: Number(fd.get("sort_order") || 0) };
      await api(`/photos/${id}`, { method: "PUT", body: JSON.stringify(body) });
      closeModal(); toast("Fotka uložena"); renderPhotos();
    };
  });
};

/* ─── Members (with gallery picker + upload) ─── */
const memberFields = [
  { key: "name", label: "Jméno", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "description", label: "Popis", type: "textarea" },
  { key: "sort_order", label: "Pořadí", type: "number" },
];

function renderEquipmentEditor(json) {
  const items = (() => { try { return JSON.parse(json); } catch { return []; } })();
  let html = `<div class="form-group"><label>Vybavení</label><div id="equipment-list">`;
  for (let i = 0; i < items.length; i++) {
    html += equipmentItemHTML(i, items[i].name, items[i].link || "");
  }
  html += `</div><button type="button" class="btn btn-sm btn-edit" onclick="addEquipmentItem()" style="margin-top:8px">+ Přidat položku</button></div>`;
  return html;
}

function equipmentItemHTML(i, name, link) {
  return `<div class="equipment-row" style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
    <input type="text" name="eq_name_${i}" value="${String(name||"").replace(/"/g,"&quot;")}" placeholder="Název" style="flex:2">
    <input type="text" name="eq_link_${i}" value="${String(link||"").replace(/"/g,"&quot;")}" placeholder="Odkaz (volitelný)" style="flex:2">
    <button type="button" class="btn btn-sm btn-del" onclick="this.closest('.equipment-row').remove()">✕</button>
  </div>`;
}

window.addEquipmentItem = () => {
  const list = document.getElementById("equipment-list");
  const i = list.children.length;
  const div = document.createElement("div"); div.className = "equipment-row";
  div.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:6px";
  div.innerHTML = `<input type="text" name="eq_name_${i}" placeholder="Název" style="flex:2"><input type="text" name="eq_link_${i}" placeholder="Odkaz (volitelný)" style="flex:2"><button type="button" class="btn btn-sm btn-del" onclick="this.closest('.equipment-row').remove()">✕</button>`;
  list.appendChild(div);
};

function collectEquipment() {
  const rows = document.querySelectorAll("#equipment-list .equipment-row");
  const items = [];
  rows.forEach((r) => {
    const inputs = r.querySelectorAll("input");
    const name = inputs[0]?.value?.trim();
    if (name) items.push({ name, link: inputs[1]?.value?.trim() || undefined });
  });
  return items.length ? JSON.stringify(items) : null;
}

async function renderMembers() {
  const data = await api("/members") || [];
  document.getElementById("app").innerHTML = shell(`<div class="table-wrap"><div class="toolbar"><h2>Členové kapely</h2><div class="toolbar-actions">${sortToggle("members")}<button class="btn btn-primary" onclick="openMemberAdd()">+ Přidat</button></div></div>
    <table><thead><tr><th>Foto</th><th>Jméno</th><th>Role</th><th></th></tr></thead>
    <tbody>${data.length ? data.map((r) => `<tr><td>${r.photo ? `<img src="${r.photo}" style="width:48px;height:48px;object-fit:cover;border-radius:50%">` : "—"}</td><td><strong>${r.name||""}</strong></td><td>${r.role||""}</td><td class="actions"><button class="btn btn-sm btn-edit" onclick="openMemberEdit(${r.id})">✏️</button> <button class="btn btn-sm btn-del" onclick="delItem('members',${r.id})">🗑️</button></td></tr>`).join("") : `<tr><td colspan="4" class="empty">Žádní členové</td></tr>`}</tbody></table></div>`);
}

window.openMemberAdd = () => {
  window._mp = "";
  modal(`<h2>Přidat člena</h2><form id="form">
    <div class="form-group"><label>Fotka</label>
      <div style="display:flex;gap:8px;align-items:center">
        <input type="file" id="memberPhotoFile" name="photoFile" accept="image/*" style="flex:1" onchange="document.getElementById('memberPhotoLabel').textContent=this.files[0]?.name||''">
        <button type="button" class="btn btn-sm btn-edit" onclick="openGalleryPicker((src)=>{document.getElementById('memberPhotoPreview').src=src;document.getElementById('memberPhotoPreview').style.display='block';document.getElementById('memberPhotoLabel').textContent=src;window._mp=src})">🖼 Z galerie</button>
      </div>
      <span id="memberPhotoLabel" style="font-size:12px;color:var(--text2)"></span>
      <img id="memberPhotoPreview" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px;display:none">
    </div>
    ${memberFields.map((f) => f.type === "textarea" ? `<div class="form-group"><label>${f.label}</label><textarea name="${f.key}"></textarea></div>` : `<div class="form-group"><label>${f.label}</label><input type="${f.type}" name="${f.key}"></div>`).join("")}
    ${renderEquipmentEditor("")}
    <div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary" id="saveBtn">Uložit</button></div></form>`);
  document.getElementById("form").onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("saveBtn"); btn.disabled = true; btn.textContent = "Nahrávám...";
    const fd = new FormData(e.target);
    let photo = "";
    if (e.target.photoFile.files[0]) {
      const up = await uploadFile(e.target.photoFile.files[0]);
      if (up?.src) photo = up.src;
    } else if (window._mp) {
      photo = window._mp;
    }
    window._mp = null;
    const body = {};
    memberFields.forEach((f) => { const v = fd.get(f.key); if (v) body[f.key] = f.type === "number" ? Number(v) : v; });
    const eq = collectEquipment();
    body.equipment = eq;
    if (photo) body.photo = photo;
    await api("/members", { method: "POST", body: JSON.stringify(body) });
    closeModal(); toast("Člen přidán"); renderMembers();
  };
};

window.openMemberEdit = (id) => {
  api("/members").then((data) => {
    const item = data.find((r) => r.id === id);
    if (!item) return;
    window._mp = item.photo || "";
    modal(`<h2>Upravit člena</h2><form id="form">
      <div class="form-group"><label>Fotka (nechat prázdné = ponechat stávající)</label>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="file" id="memberPhotoFile" name="photoFile" accept="image/*" style="flex:1" onchange="document.getElementById('memberPhotoLabel').textContent=this.files[0]?.name||''">
          <button type="button" class="btn btn-sm btn-edit" onclick="openGalleryPicker((src)=>{document.getElementById('memberPhotoPreview').src=src;document.getElementById('memberPhotoPreview').style.display='block';document.getElementById('memberPhotoLabel').textContent=src;window._mp=src})">🖼 Z galerie</button>
        </div>
        <span id="memberPhotoLabel" style="font-size:12px;color:var(--text2)">${item.photo ? item.photo : ""}</span>
        ${item.photo ? `<img id="memberPhotoPreview" src="${item.photo}" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px">` : `<img id="memberPhotoPreview" style="max-width:200px;max-height:100px;margin-top:8px;border-radius:4px;display:none">`}
      </div>
      ${memberFields.map((f) => f.type === "textarea" ? `<div class="form-group"><label>${f.label}</label><textarea name="${f.key}">${item[f.key] ?? ""}</textarea></div>` : `<div class="form-group"><label>${f.label}</label><input type="${f.type}" name="${f.key}" value="${String(item[f.key] ?? "").replace(/"/g,"&quot;")}"></div>`).join("")}
      ${renderEquipmentEditor(item.equipment || "")}
      <div class="modal-actions"><button type="button" class="btn btn-cancel" onclick="closeModal()">Zrušit</button><button type="submit" class="btn btn-primary" id="saveBtn">Uložit</button></div></form>`);
    document.getElementById("form").onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById("saveBtn"); btn.disabled = true; btn.textContent = "Ukládám...";
      const fd = new FormData(e.target);
      let photo = item.photo;
      if (e.target.photoFile.files[0]) {
        const up = await uploadFile(e.target.photoFile.files[0]);
        if (up?.src) photo = up.src;
      } else if (window._mp && window._mp !== item.photo) {
        photo = window._mp;
      }
      window._mp = null;
      const body = {};
      memberFields.forEach((f) => { const v = fd.get(f.key); body[f.key] = f.type === "number" ? Number(v) : v; });
      const eq = collectEquipment();
      body.equipment = eq;
      body.photo = photo;
      await api(`/members/${id}`, { method: "PUT", body: JSON.stringify(body) });
      closeModal(); toast("Člen uložen"); renderMembers();
    };
  });
};

/* ─── Init ─── */
route();
