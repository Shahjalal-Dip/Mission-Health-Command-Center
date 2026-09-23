import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Used ONLY to generate a single self-contained HTML file for quick preview.
// The real project build (for deployment) uses vite.config.js.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist-preview',
    cssCodeSplit: false,
  },
})
