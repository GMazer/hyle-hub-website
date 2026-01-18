
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  root: '.',
  assetsInclude: ['**/*.riv'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'apps/storefront/src'),
    },
  },
  optimizeDeps: {
    include: ['@rive-app/react-canvas', '@rive-app/canvas']
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
        // Removed 'admin' entry pointing to apps/admin/index.html
      }
    }
  }
});
