// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import path from 'path';

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),
//     tailwindcss()
//   ],
//   css: {
//     postcss: "./postcss.config.js", // Указываем путь к конфигурации PostCSS
//   },
//     alias: {
//       '@': path.resolve(__dirname, './src'), // Алиас для папки src
//     },

//   server: {
//     host: 'localhost',
//     port: 3002,
//     // другие настройки сервера
//   },

// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  css: {
    postcss: "./postcss.config.js", // Указываем путь к конфигурации PostCSS
  },
  resolve: { // <-- Секция resolve
    alias: {
      '@': path.resolve(__dirname, './src'), // Алиас для папки src
    },
  },
  server: {
    host: 'localhost',
    port: 3002,
    // другие настройки сервера
  },
});
