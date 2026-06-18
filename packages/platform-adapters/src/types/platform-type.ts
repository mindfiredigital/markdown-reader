import type { AppSettings, FileType, FolderSearchResult, RecentFile } from '@package/shared-types';
import type { StorageAdapter } from './storage-type';

export type PlatformKind = 'electron' | 'chrome';

export interface PlatformMessage<TPayload = unknown> {
  type: string;
  payload?: TPayload;
}

export interface PlatformAdapter {
  readonly kind: PlatformKind;
  readonly storage: StorageAdapter;

  readFile(path: string): Promise<string>;
  watchFile(path: string): Promise<void>;
  unWatchFile(path: string): Promise<void>;
  openFileDialog(): Promise<string | null>;
  openFolderDialog(): Promise<string | null>;
  readFolder(path: string): Promise<FileType | null>;
  getRecentFiles(): Promise<RecentFile[]>;
  addRecentFile(path: string): Promise<void>;
  clearRecentFiles(): Promise<void>;
  getSettings(): Promise<AppSettings>;
  saveSettings(settings: Partial<AppSettings>): Promise<AppSettings>;
  getAppVersion(): Promise<string>;
  searchFolder(path: string, query: string): Promise<FolderSearchResult[]>;
  onFileChanged(callback: (path: string) => void): void;
  removeFileChangedListener(): void;
  onMenuEvent(event: string, callback: (payload?: unknown) => void): () => void;
  removeMenuListeners(): void;
  onOpenFilePath(callback: (path: string) => void): void;
  removeOpenFilePathListener(): void;
  showSaveDialog(options?: { defaultExt?: string; defaultPath?: string }): Promise<string | null>;
  exportHTML(html: string, css: string, outputPath: string): Promise<void>;
  exportPDF(html: string, css: string, outputPath: string): Promise<void>;
  exportDOCX(html: string, css: string, outputPath: string): Promise<void>;
  getPathForFile(file: File): string;
  onUpdateAvailable(callback: (version: string) => void): () => void;
  downloadUpdate(): void;
  sendMessage<TResponse = unknown, TPayload = unknown>(
    message: PlatformMessage<TPayload>
  ): Promise<TResponse>;
}
