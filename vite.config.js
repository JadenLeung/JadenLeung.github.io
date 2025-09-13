import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //base: "/Jaden-portfolio/",
  css: {
    modules: {
      localsConvention: "camelCase"
    },
  },
  server: {
    host: '0.0.0.0', // listen on all addresses
    port: 5173
  }
});
