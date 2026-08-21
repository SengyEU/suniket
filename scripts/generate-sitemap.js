import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const today = new Date().toISOString().split("T")[0];

const urls = [
  { path: "/", priority: "1.0" },
  { path: "/o-nas", priority: "0.9" },
  { path: "/tour", priority: "0.8" },
  { path: "/diskografie", priority: "0.8" },
  { path: "/galerie/foto", priority: "0.7" },
  { path: "/galerie/video", priority: "0.7" },
  { path: "/novinky", priority: "0.8" },
  { path: "/kontakt", priority: "0.6" },
  { path: "/merch", priority: "0.8" },
  { path: "/kapela/victor-hrazdil", priority: "0.5" },
  { path: "/kapela/lukas-janata", priority: "0.5" },
  { path: "/kapela/marek-dudkovic", priority: "0.5" },
  { path: "/kapela/dominik-hrazdil", priority: "0.5" },
  { path: "/kapela/krystof-dolezel", priority: "0.5" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>https://suniket.cz${u.path}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>\n`;

writeFileSync(join(__dirname, "..", "public", "sitemap.xml"), xml);
console.log("✓ sitemap.xml generated");
