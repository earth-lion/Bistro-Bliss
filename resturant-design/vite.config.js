import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const base = "/Bistro-Bliss/";

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "pwa-192x192.png", "pwa-512x512.png"],
      manifest: {
        name: "Bistro Bliss — Restaurant",
        short_name: "Bistro Bliss",
        description:
          "Order food online, book a table, and enjoy the finest dining experience at Bistro Bliss.",
        theme_color: "#AD343E",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: base,
        start_url: base,
        lang: "en",
        icons: [
          {
            src: `${base}pwa-192x192.png`,
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: `${base}pwa-512x512.png`,
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        categories: ["food", "lifestyle", "shopping"],
        screenshots: [
          {
            src: `${base}pwa-512x512.png`,
            sizes: "512x512",
            type: "image/png",
            form_factor: "wide",
          },
        ],
      },
      workbox: {
        // Cache menu data and static assets
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/127\.0\.0\.1:8000\/api\/menu/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-menu-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 }, // 24h
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /^https?:\/\/127\.0\.0\.1:8000\/api\/categories/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-categories-cache",
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 }, // 30 days
            },
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
