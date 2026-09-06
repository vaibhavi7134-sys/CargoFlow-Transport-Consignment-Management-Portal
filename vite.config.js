import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// base is '/' for Vercel (root deployment)
export default defineConfig({
  plugins: [react()],
  base: '/',
})
