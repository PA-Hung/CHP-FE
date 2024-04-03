import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      assets: `${path.resolve(__dirname, "./src/assets/")}`,
      components: `${path.resolve(__dirname, "./src/components/")}`,
      routers: `${path.resolve(__dirname, "./src/router/")}`,
      styles: `${path.resolve(__dirname, "./src/styles/")}`,
      utils: `${path.resolve(__dirname, "./src/utils/")}`,
      reduxs: `${path.resolve(__dirname, "./src/redux/")}`,
    },
  },
})
