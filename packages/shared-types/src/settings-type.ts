// type of user preferences settings
export type ReadingWidth = 'narrow' | 'default' | 'wide';
export type Theme = 'github-light' | 'github-dark' | 'notion' | 'nord' | 'minimal' | 'dracula';
export interface AppSettings {
  theme: Theme;
  fontSize: number;
  readingWidth: ReadingWidth;
  lineNumbers: boolean;
  customCss: string;
  zoom: number;
  recentFilesLimit: number;
  showHiddenFiles: boolean;
}

export type Settings = AppSettings;

// initial setting
export const DEFAULT_SETTINGS: Settings = {
  theme: 'github-light',
  fontSize: 16,
  readingWidth: 'default',
  lineNumbers: false,
  customCss: '',
  zoom: 100,
  recentFilesLimit: 10,
  showHiddenFiles: false,
};
