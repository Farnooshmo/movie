import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Specify the desired port for the Vite development server
    host: '0.0.0.0', // Bind to 0.0.0.0 to allow external access
  },
});