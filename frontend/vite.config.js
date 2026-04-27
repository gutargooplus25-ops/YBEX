import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,          // expose on all network interfaces (0.0.0.0)
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',   // use IPv4 explicitly — avoids ::1 ECONNREFUSED on Node 18+
        changeOrigin: true,
      },
    },
  },
})
