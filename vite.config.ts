import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/backend_php_hridaya": {
        target: "http://localhost",
        changeOrigin: true,
      },
    },
  },
});
