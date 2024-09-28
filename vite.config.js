import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3000, host: "0.0.0.0" },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // strategies: "injectManifest",
      // injectManifest: {
      //   swSrc: "src/sw.js", // Path to your custom service worker file
      //   swDest: "dist/", // Output file path
      // },
      srcDir: "src",
      filename: "sw.js", // Custom name for the VitePWA service worker
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "/icons/apple-touch-icon.png",
      ],
      manifest: {
        name: "CRM",
        short_name: "CRM",
        description: "app for cover all employees needs",
        display_override: ["fullscreen"],
        icons: [
          {
            src: "/icons/logo192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/logo144.png",
            sizes: "144x144",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "favicon.ico",
            sizes: "48x48",
            type: "image/x-icon",
          },
          {
            src: "/icons/favicon-32x32.ico",
            sizes: "32x32",
            type: "image/x-icon",
          },
          {
            src: "/icons/favicon-16x16.ico",
            sizes: "16x16",
            type: "image/x-icon",
          },
          {
            src: "/icons/logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "/icons/logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        // screenshots: [
        //   {
        //     src: "/icons/in-out-wide.gif",
        //     sizes: "664x448",
        //     type: "image/gif",
        //     form_factor: "wide",
        //     label: "Wonder Widgets",
        //   },
        //   {
        //     src: "/icons/in-out.gif",
        //     sizes: "440x824",
        //     type: "image/gif",
        //     form_factor: "narrow",
        //     label: "Wonder Widgets",
        //   },
        // ],
        start_url: "/login",
        id: "/",
        display: "standalone",
        theme_color: "#fff",
        background_color: "#111",
        lang: "fa",
      },
      workbox: {
        // Additional Workbox options if needed
      },
      // Listen for updates
      devOptions: {
        enabled: true,
        type: "module",
      },
      onUpdate: async (registration) => {
        if (registration && registration.waiting) {
          // Notify the user
          console.log("update found");
        }
      },
    }),
  ],
});
