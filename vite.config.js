import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',  // Simulates a browser environment for testing DOM interactions
    setupFiles: './src/tests/setup.js',
    globals: true,
    coverage: {
      reporter: ['text', 'html'],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
