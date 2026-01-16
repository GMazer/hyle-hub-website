import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', 
  base: '/admin/', // Đường dẫn cơ sở cho Admin
  server: {
    port: 3001,
    open: true
  },
  // Xóa phần resolve alias dùng path để tránh lỗi TS2688 trên Netlify
});