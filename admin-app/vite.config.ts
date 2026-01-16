import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', 
  base: '/admin/', // QUAN TRỌNG: Đổi từ './' thành '/admin/' để đảm bảo assets load đúng
  server: {
    port: 3001,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
});