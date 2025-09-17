import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Use repo name as base for GitHub Pages
  base: '/secosha/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
