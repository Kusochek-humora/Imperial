import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

import htmlInclude from './src/plugins/html-include.js';

export default defineConfig({
  // относительные пути в сборке: работает из любой папки (GitHub Pages, любой хостинг)
  base: './',
  // для GitHub Pages «main + /docs» раскомментировать:
  // build: { outDir: 'docs', emptyOutDir: true },
  plugins: [htmlInclude()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    open: true,
  },
});
