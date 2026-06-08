import { Theme } from '@package/shared-constants';

/*checks user's system color scheme preference. */
export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'github-dark' : 'github-light';
}
