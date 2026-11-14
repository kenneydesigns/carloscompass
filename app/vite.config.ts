import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The engine (this app) reads content from the pack folder one level up.
export default defineConfig({
  plugins: [react()],
  server: { host: true, fs: { allow: ['..'] } },
})
