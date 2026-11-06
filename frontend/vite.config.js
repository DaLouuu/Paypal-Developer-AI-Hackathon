import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/v1': 'http://localhost:8000',
      '/discovery': 'http://localhost:8000',
      '/mcp': 'http://localhost:8000',
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          aggrid: ['ag-grid-react', 'ag-grid-community'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
