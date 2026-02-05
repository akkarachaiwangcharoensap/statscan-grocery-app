import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Support GitHub Pages deployment with repository subdirectory
  // Extract the repository name from the environment or use '/' for root deployment
  base: process.env.GITHUB_ACTIONS ? '/statscan-grocery-app/' : '/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
});