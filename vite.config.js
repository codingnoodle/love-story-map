import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        loveMap: './love-map.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
