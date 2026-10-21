import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    // three.js + React Three Fiber form one ~915 kB chunk (~243 kB gzip). It is
    // only loaded lazily by the 3D scenes, never by the main bundle.
    chunkSizeWarningLimit: 1000,
  },
})
