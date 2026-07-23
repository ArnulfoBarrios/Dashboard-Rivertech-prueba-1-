import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  json: {
    stringify: true, // Optimizes large JSON files import like realtimelog_32historic.json
  },
  server: {
    port: 3000,
    open: true,
  },
});
