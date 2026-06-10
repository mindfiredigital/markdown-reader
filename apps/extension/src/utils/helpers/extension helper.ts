import { ExtensionTheme } from '../../types';
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from '@package/shared-constants';
import { themes } from '../constants/theme-constants';

export function isExtensionTheme(theme: string): theme is ExtensionTheme {
  return themes.includes(theme as ExtensionTheme);
}

export function clampFontSize(fontSize: number) {
  return Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, fontSize));
}
