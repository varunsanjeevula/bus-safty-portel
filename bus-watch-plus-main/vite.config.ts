import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // ✅ Allow all ngrok domains + localhost
    allowedHosts: [
      ".ngrok-free.app",
      ".ngrok.app",
      ".ngrok.io",
      ".ngrok.dev",
      "localhost",
      "127.0.0.1",
    ],
    cors: true, // optional: ensures cross-domain requests from ngrok work smoothly
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "Bus Safety Tracker",
        short_name: "Bus Safety",
        description: "Track bus safety in real-time with QR code scanning",
        theme_color: "#1e6fcc",
        background_color: "#f0f4f8",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
