import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: "/Pixel-Animal-Cross-Field-FrontEnd/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
