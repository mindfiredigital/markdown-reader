import { AppSettings } from '@package/shared-types';

export const SETTINGS_KEYS = new Set<keyof AppSettings>([
  'theme',
  'fontSize',
  'readingWidth',
  'lineNumbers',
  'customCss',
  'zoom',
  'recentFilesLimit',
  'showHiddenFiles',
]);

export const READING_WIDTHS = new Set<AppSettings['readingWidth']>(['narrow', 'default', 'wide']);
