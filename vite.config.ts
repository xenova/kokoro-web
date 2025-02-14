import path from "path";

import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  worker: { format: "es" },
  build: {
    target: "esnext",
  },
  logLevel: process.env.NODE_ENV === "development" ? "error" : "info",
});
