import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: resolve(__dirname, 'apps/extension'),
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'dist/extension'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'apps/extension/popup.html'),
        viewer: resolve(__dirname, 'apps/extension/viewer.html'),
      },
    },
  },
});
