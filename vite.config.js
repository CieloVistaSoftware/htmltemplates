import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:5001'
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
