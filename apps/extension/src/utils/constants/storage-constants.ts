import { DEFAULT_FONT_SIZE } from '@package/shared-constants';
import { ExtensionSettings } from '../../types';

export const SETTINGS_KEY = 'markdownReaderSettings';

export const defaultExtensionSettings: ExtensionSettings = {
  theme: 'github-light',
  fontSize: DEFAULT_FONT_SIZE,
};
