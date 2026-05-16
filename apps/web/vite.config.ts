import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['web-production-096ce.up.railway.app']
  },
  server: {
    // In dev mode VITE_API_URL is left unset (empty string) so that
    // requests fall through to this proxy. In production, set
    // VITE_API_URL to the API service's public domain instead.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
