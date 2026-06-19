import { copyFileSync, cpSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const chromeExtensionRoot = __dirname;
const rendererRoot = resolve(chromeExtensionRoot, '../../renderer');
const extensionOutDir = resolve(chromeExtensionRoot, '../../dist/extensions/chrome');
const manifestSource = resolve(chromeExtensionRoot, 'manifest.json');
const iconSourceDir = resolve(chromeExtensionRoot, '../../assets/icons');

export default defineConfig({
  root: chromeExtensionRoot,
  base: './',
  publicDir: resolve(rendererRoot, 'public'),
  resolve: {
    alias: {
      '@package/platform-adapters': resolve(
        chromeExtensionRoot,
        '../../packages/platform-adapters/src/index.ts'
      ),
    },
  },
  plugins: [
    tailwindcss(),
    react({}),
    {
      name: 'copy-chrome-extension-assets',
      closeBundle() {
        mkdirSync(extensionOutDir, { recursive: true });
        copyFileSync(manifestSource, resolve(extensionOutDir, 'manifest.json'));
        try {
          cpSync(iconSourceDir, resolve(extensionOutDir, 'icons'), { recursive: true });
        } catch (e) {
          if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
            console.warn('Icon directory not found, skipping copy step.');
          } else {
            throw e;
          }
        }
      },
    },
  ],
  build: {
    outDir: extensionOutDir,
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        popup: resolve(chromeExtensionRoot, 'popup.html'),
        viewer: resolve(chromeExtensionRoot, 'viewer.html'),
        background: resolve(chromeExtensionRoot, 'src/background.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js';
          }
          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
