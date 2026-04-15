import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    build: {
      externalizeDeps: true,
      lib: {
        entry: resolve(__dirname, 'src-main/index.ts'),
      },
    },
  },
  preload: {
    build: {
      externalizeDeps: true,
      lib: {
        entry: resolve(__dirname, 'src-main/preload.ts'),
      },
    },
  },
  renderer: {
    root: resolve(__dirname, 'src-renderer'),
    plugins: [react({})],
    build: {
      rollupOptions: {
        input: resolve(__dirname, 'src-renderer/index.html'),
      },
    },
  },
});
