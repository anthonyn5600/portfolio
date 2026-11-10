import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev: `npm run dev` serves index.html, a preview page that shows each demo
// on the site's ground (?capture=hero or ?capture=campus shows one alone,
// for filming).
// Build: one script and one stylesheet with stable names in ../assets/demos,
// which the static site loads. GitHub Pages serves them as committed files,
// so there is no build step on deploy.
export default defineConfig({
  plugins: [react()],
  server: { host: '127.0.0.1' },
  build: {
    target: 'es2020',
    outDir: '../assets/demos',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: 'src/main.tsx',
      // A classic script (IIFE), not a module, so the page still runs its
      // demos when index.html is opened straight from disk (file://)
      output: {
        format: 'iife',
        entryFileNames: 'demos.js',
        assetFileNames: 'demos[extname]',
      },
    },
  },
})
