import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Jammming/',  // required for GitHub Pages: https://kaich1k.github.io/Jammming/
})
