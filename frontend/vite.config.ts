import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
import 'dotenv/config'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
        "process.env": process.env,
    },
  server: {
    proxy: {
      // Esta regra é a chave de tudo:
      '/api': {
        target: process.env.BACKEND_URL, // O endereço do seu backend
        changeOrigin: true,
      },
    },
  },
});
