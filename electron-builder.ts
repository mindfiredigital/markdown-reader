import type { Configuration } from 'electron-builder';

const config: Configuration = {
  appId: 'com.markdown.reader',
  productName: 'Markdown Reader',
  directories: {
    output: 'release',
  },
  files: ['out/**/*', 'package.json', 'assets/**/*'],
  asar: true,
  fileAssociations: [
    {
      ext: ['md', 'markdown'],
      name: 'Markdown File',
      description: 'Markdown document',
      icon: 'assets/icon.ico',
      rank: 'Owner',
    },
  ],
  publish: [{ provider: 'github' }],
  mac: {
    category: 'public.app-category.productivity',
    icon: 'assets/icon.icns',
    target: ['dmg'],
    type: 'distribution',
  },
  win: {
    icon: 'assets/icon.ico',
    target: [{ target: 'nsis', arch: ['x64', 'arm64'] }],
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
  },
  linux: {
    icon: 'assets/',
    target: ['AppImage', 'deb'],
    category: 'Utility',
    mimeTypes: ['text/markdown'],
  },
};

export default config;
