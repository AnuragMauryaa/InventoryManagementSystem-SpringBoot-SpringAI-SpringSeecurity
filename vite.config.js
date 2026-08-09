import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Pure frontend app — no API proxy needed (data is served from the in-memory store).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
