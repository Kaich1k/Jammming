import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Jammming/',  // required for GitHub Pages: https://kaich1k.github.io/Jammming/
  envDir: __dirname,   // load .env from folder containing vite.config.js (project root)
})
