import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import React from "react";


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Alias for `src`
      '~': path.resolve(__dirname),          // Alias for project root
    },
  },
});


