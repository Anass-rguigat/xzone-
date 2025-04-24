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
    outDir: 'public/build',
    emptyOutDir: true,
    ssr: 'resources/js/ssr.tsx', // Specify the SSR entry file here
    rollupOptions: {
      output: {
        format: 'esm',  // This ensures the output is an ES module for SSR
        dir: 'bootstrap/ssr', // Output location for SSR bundle
      },
    },
  }
});
