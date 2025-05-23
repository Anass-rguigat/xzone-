import path from 'path';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/app.tsx',
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'), // This resolves @ to resources/js
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js'], // Add .jsx here
  },
  build: {
    outDir: 'public/build', // Specify the output directory
    emptyOutDir: true, // Ensure the output directory is empty before building
  },
});
