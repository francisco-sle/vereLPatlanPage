import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { seo } from "./scripts/seo-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seo()],
  build: {
    target: "es2022",
  },
});
