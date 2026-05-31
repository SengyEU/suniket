const BASE = "https://api.suniket.cz/api";
const ASSET_BASE = "https://api.suniket.cz";

async function fetchJSON(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function assetUrl(path) {
  if (!path) return "";
  if (path.startsWith("/uploads/")) return `${ASSET_BASE}${path}`;
  return path;
}

export function fetchTimeline() {
  return fetchJSON("/timeline");
}

export function fetchConcerts() {
  return fetchJSON("/concerts");
}

export function fetchDiscography() {
  return fetchJSON("/discography");
}

export function fetchNews() {
  return fetchJSON("/news");
}

export function fetchPhotos() {
  return fetchJSON("/photos");
}

export function fetchVideos() {
  return fetchJSON("/videos");
}

export function fetchMembers() {
  return fetchJSON("/members");
}

export function fetchContactSettings() {
  return fetchJSON("/contact-settings");
}
