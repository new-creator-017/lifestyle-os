import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest", // CRITICAL: Tells Vite to compile your custom SW
      srcDir: "src", // Look in the src folder
      filename: "firebase-messaging-sw.js", // The file to compile
      registerType: "autoUpdate",
      injectManifest: {
        injectionPoint: undefined, // Prevents Workbox errors since we aren't precaching files yet
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Lifestyle OS",
        short_name: "Lifestyle",
        description: "System core for daily metrics and targets.",
        theme_color: "#0a0c10",
        background_color: "#0a0c10",
        display: "standalone",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
