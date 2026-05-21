import { FileType } from './file-types';
import { RecentFile } from './recentfile-type';
import { Settings } from './settings-type';

// markdown reader api
export type MarkdownReaderAPI = {
  readFile(path: string): Promise<string>;
  watchFile(path: string): Promise<void>;
  unWatchFile(path: string): Promise<void>;
  openFileDialog(): Promise<string | null>;
  openFolderDialog(): Promise<string | null>;
  readFolder(path: string): Promise<FileType | null>;
  getRecentFiles(): Promise<RecentFile[]>;
  addRecentFile(path: string): Promise<void>;
  clearRecentFiles(): Promise<void>;
  getSettings(): Promise<Settings>;
  saveSettings(settings: Settings[]): Promise<void>;
  getAppVersion(): Promise<string>;
  onFileChanged: (callback: (path: string) => void) => void;
  removeFileChangedListener: () => void;
  onMenuEvent: (event: string, callback: () => void) => void;
  removeMenuListeners: () => void;
  onOpenFilePath(callback: (path: string) => void): void;
  removeOpenFilePathListener(): void;
  showSaveDialog(options?: { defaultExt?: string; defaultPath?: string }): Promise<string | null>;
  exportHTML(html: string, css: string, outputPath: string): Promise<void>;
  exportPDF(html: string, css: string, outputPath: string): Promise<void>;
  exportDOCX(html: string, css: string, outputPath: string): Promise<void>;
};

// initial setting
export const DEFAULT_SETTINGS: Settings = {
  theme: 'github-light',
  fontSize: 16,
  readingWidth: 'default',
  showLineNumbers: false,
};
