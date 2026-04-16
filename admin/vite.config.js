import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiProxyTarget = process.env.VITE_PROXY_API_TARGET || "https://www.ntdev.lt";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  preview: {
    port: 5174,
    host: true,
    strictPort: false,
    watch: {
      usePolling: true,
    },
  },
  server: {
    port: 5174,
    strictPort: false,
    host: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
    // proxy: {
    //   '/api': {
    //     // when running inside Docker, target the api service by name
    //     target: 'http://api:3000',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },

  // base: '/admin',

  build: {
    manifest: true, // For integration with Nginx
  },
});
