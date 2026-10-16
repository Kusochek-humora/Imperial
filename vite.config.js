import fs from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

import htmlInclude from './src/plugins/html-include.js';

const root = fileURLToPath(new URL('.', import.meta.url));

// многостраничный сайт: каждая .html в корне проекта — отдельная страница сборки
const pages = Object.fromEntries(
  fs
    .readdirSync(root)
    .filter((file) => file.endsWith('.html'))
    .map((file) => [file.replace(/\.html$/, ''), fileURLToPath(new URL(file, import.meta.url))]),
);

export default defineConfig({
  // относительные пути в сборке: работает из любой папки (GitHub Pages, любой хостинг)
  base: './',
  plugins: [htmlInclude()],
  build: {
    // для GitHub Pages «main + /docs» раскомментировать:
    // outDir: 'docs',
    // emptyOutDir: true,
    rollupOptions: {
      input: pages,
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    open: true,
  },
});
