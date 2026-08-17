import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": { target: "http://127.0.0.1:3001", changeOrigin: true },
      "/health": { target: "http://127.0.0.1:3001", changeOrigin: true },
      "/sitemap.xml": { target: "http://127.0.0.1:3001", changeOrigin: true },
      "/robots.txt": { target: "http://127.0.0.1:3001", changeOrigin: true },
    },
  },
})
