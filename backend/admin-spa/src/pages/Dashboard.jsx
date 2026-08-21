import { useState, useEffect } from "react";
import { api } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api("/timeline"),
      api("/concerts"),
      api("/albums"),
      api("/news"),
      api("/members"),
      api("/photos"),
      api("/videos"),
    ]).then(([timeline, concerts, albums, news, members, photos, videos]) => {
      const up = concerts ? concerts.filter((c) => c.is_upcoming).length : 0;
      const pa = concerts ? concerts.length - up : 0;
      setStats({ timeline, up, pa, albums, news, members, photos, videos });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="empty">Načítám...</div>;

  return (
    <>
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat-card">
          <div className="num">{stats.timeline?.length || 0}</div>
          <div className="label">Timeline</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.up}</div>
          <div className="label">Nadcházející koncerty</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.pa}</div>
          <div className="label">Proběhlé koncerty</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.albums?.length || 0}</div>
          <div className="label">Alba</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.news?.length || 0}</div>
          <div className="label">Novinky</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.members?.length || 0}</div>
          <div className="label">Členové</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.photos?.length || 0}</div>
          <div className="label">Fotky</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats.videos?.length || 0}</div>
          <div className="label">Videa</div>
        </div>
      </div>
    </>
  );
}
