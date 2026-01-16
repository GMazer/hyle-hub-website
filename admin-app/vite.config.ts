import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Ensure root is current folder
  base: './', // Use relative paths for assets
  server: {
    port: 3001, // Run on port 3001 to avoid conflict with Landing page (usually 3000/5173)
    open: true // Auto open browser
  },
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
});