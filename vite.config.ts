import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000
  },
  assetsInclude: ['**/*.JPG', '**/*.jpg'], // Add this line
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
