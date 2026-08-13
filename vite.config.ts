import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    // Собранная игра — один самодостаточный файл docs/index.html.
    // Его можно коммитить и открывать на GitHub Pages (main → /docs)
    // или просто двойным кликом в браузере (работает без сервера).
    outDir: "docs",
    emptyOutDir: false, // не стирать .md-файлы сюжета в docs/
  },
  server: {
    host: true,
    // Allow the sandbox preview host (e2b.app) to reach the dev server
    allowedHosts: true,
  },
});
