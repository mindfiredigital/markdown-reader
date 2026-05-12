import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['introduction', 'installation', 'features'],
    },
    {
      type: 'category',
      label: 'Using Markdown Reader',
      items: ['keyboard-shortcuts'],
    },
    {
      type: 'category',
      label: 'Developers',
      items: ['development', 'release-notes'],
    },
  ],
};

export default sidebars;
