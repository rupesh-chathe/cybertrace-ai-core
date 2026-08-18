import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",
    allowedHosts: ["cybertrace-ai-core.onrender.com"],
  },

  preview: {
    host: "0.0.0.0",
    allowedHosts: ["cybertrace-ai-core.onrender.com"],
  },
});
