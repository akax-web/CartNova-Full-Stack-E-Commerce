import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/CartNova-Full-Stack-E-Commerce/',
  server: {
    port: 5173,
  },
});