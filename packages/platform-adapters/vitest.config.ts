import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setup.ts',
    coverage: {
      exclude: ['__tests__/**', 'dist/**', 'node_modules/**', 'setup.ts', 'vitest.config.ts'],
    },
  },
  resolve: {
    alias: {
      '@platform-adapters': resolve(__dirname, './src'),
    },
  },
});
