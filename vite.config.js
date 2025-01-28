import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
    alias: {
      '@': path.resolve(__dirname, './src'), // Алиас для папки src
    },

  server: {
    host: '10.90.25.125',
    port: 3002,
    // другие настройки сервера
  },

})
