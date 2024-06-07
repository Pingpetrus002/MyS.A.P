import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../static',  // Output directory for build
    emptyOutDir: true,    // Empty the directory before building
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5000',  // Proxy API requests to Flask
    },
  },
});
