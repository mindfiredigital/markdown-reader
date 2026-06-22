import windowsIcon from '@site/static/img/downloads/windows.png';
import macosIcon from '@site/static/img/downloads/macos.png';
import linuxIcon from '@site/static/img/downloads/linux.png';
export const downloads = [
  {
    name: 'Windows',
    format: '.exe installer',
    links: [
      {
        label: 'Download',
        href: 'https://github.com/mindfiredigital/markdown-reader/releases/latest/download/Markdown-Reader-Setup.exe',
      },
    ],
    icon: windowsIcon,
  },
  {
    name: 'macOS',
    format: '.dmg package',
    links: [
      {
        label: 'Download',
        href: 'https://github.com/mindfiredigital/markdown-reader/releases/latest/download/Markdown-Reader.dmg',
      },
    ],
    icon: macosIcon,
  },
  {
    name: 'Linux',
    format: '.AppImage / .deb',
    links: [
      {
        label: 'DEB',
        href: 'https://github.com/mindfiredigital/markdown-reader/releases/latest/download/Markdown-Reader.deb',
      },
      {
        label: 'AppImage',
        href: 'https://github.com/mindfiredigital/markdown-reader/releases/latest/download/Markdown-Reader.AppImage',
      },
    ],
    icon: linuxIcon,
  },
];

export const extensionDownload = {
  name: 'Chrome Extension',
  format: 'Browser extension',
  description:
    'Download the extension ZIP, extract it, and load it unpacked in Chrome, Edge, or Brave for instant .md file rendering.',
  links: [
    {
      label: 'Download ZIP',
      href: 'https://github.com/mindfiredigital/markdown-reader/releases/latest/download/extension-release.zip',
    },
  ],
  icon: '/img/downloads/chrome.svg',
};
