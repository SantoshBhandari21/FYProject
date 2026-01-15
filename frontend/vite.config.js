import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true, // automatically open browser
    host: true, // allow external connections
  },
  resolve: {
    alias: {
      '@': '/src', // allows using @/components/... instead of ../../components/...
    }
  }
})
