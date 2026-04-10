import { defineConfig } from 'vite'

// Use relative asset paths so the app works when loaded via file:// in Electron
export default defineConfig({
  base: './'
})
