export const THEMES = [
  'github-light',
  'github-dark',
  'notion',
  'nord',
  'minimal',
  'dracula',
] as const;

export type Theme = (typeof THEMES)[number];
