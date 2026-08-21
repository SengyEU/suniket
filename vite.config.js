import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["img/*.{webp,png,ico}"],
            manifest: {
                name: "Suniket – hardrocková kapela",
                short_name: "Suniket",
                description: "Oficiální stránky hardrockové kapely Suniket",
                theme_color: "#000000",
                background_color: "#000000",
                display: "standalone",
                start_url: "/",
                icons: [
                    {
                        src: "/img/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/img/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
        }),
    ],
    server: {
        proxy: {
            "/api": "http://localhost:3001",
        },
    },
    build: {
        sourcemap: false,
        cssCodeSplit: true,
        chunkSizeWarningLimit: 300,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                    fontawesome: [
                        "@fortawesome/fontawesome-svg-core",
                        "@fortawesome/free-solid-svg-icons",
                        "@fortawesome/free-brands-svg-icons",
                        "@fortawesome/react-fontawesome",
                    ],
                },
            },
        },
    },
});
