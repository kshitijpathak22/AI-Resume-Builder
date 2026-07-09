import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@met4citizen/talkinghead']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname),
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    }
  }
})