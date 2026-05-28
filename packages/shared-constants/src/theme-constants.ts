export const THEMES = [
  'github-light',
  'github-dark',
  'notion',
  'nord',
  'minimal',
  'dracula',
] as const;

export type Theme = (typeof THEMES)[number];

export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 24;
export const DEFAULT_FONT_SIZE = 16;
export const FONT_SIZE_INCREMENT = 2;

export const NARROW_WIDTH = 640;
export const DEFAULT_WIDTH = 768;
export const WIDE_WIDTH = 1024;
