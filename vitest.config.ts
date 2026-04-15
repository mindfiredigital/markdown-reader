import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react({})],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, './src-shared'),
      '@renderer': resolve(__dirname, './src-renderer'),
      '@main': resolve(__dirname, './src-main'),
    },
  },
});
