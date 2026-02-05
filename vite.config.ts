import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon-180.png',
        'mstile-150x150.png',
        'safari-pinned-tab.svg'
      ],
      manifest: {
        name: 'StatsCan Grocery App',
        short_name: 'Grocery',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          { src: '/android-chrome-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/android-chrome-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
          { src: '/apple-touch-icon-180.png', sizes: '180x180', type: 'image/png' }
        ]
      }
    })
  ],
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