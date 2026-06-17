import type {
  AppSettings,
  FileType,
  FolderSearchResult,
  MarkdownReaderAPI,
  RecentFile,
} from '@package/shared-types';
import { PLATFORM_KIND } from '../utils/constants/adapter-constants';
import { getElectronApi } from '../utils/helpers/adapter-helper';
import type { PlatformAdapter, PlatformMessage } from '../types/platform-type';
import type { StorageAdapter } from '../types/storage-type';

class BrowserLocalStorageAdapter implements StorageAdapter {
  async getItem<T>(key: string): Promise<T | null> {
    const value = globalThis.localStorage?.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    globalThis.localStorage?.removeItem(key);
  }

  async clear(): Promise<void> {
    globalThis.localStorage?.clear();
  }
}

export class ElectronAdapter implements PlatformAdapter {
  readonly kind = PLATFORM_KIND.ELECTRON;
  readonly storage: StorageAdapter;
  private readonly api: MarkdownReaderAPI;

  constructor(api: MarkdownReaderAPI | null = getElectronApi()) {
    if (!api) {
      throw new Error('ElectronAdapter requires window.api from the preload bridge.');
    }

    this.api = api;
    this.storage = new BrowserLocalStorageAdapter();
  }

  readFile(path: string): Promise<string> {
    return this.api.readFile(path);
  }

  watchFile(path: string): Promise<void> {
    return this.api.watchFile(path);
  }

  unWatchFile(path: string): Promise<void> {
    return this.api.unWatchFile(path);
  }

  openFileDialog(): Promise<string | null> {
    return this.api.openFileDialog();
  }

  openFolderDialog(): Promise<string | null> {
    return this.api.openFolderDialog();
  }

  readFolder(path: string): Promise<FileType | null> {
    return this.api.readFolder(path);
  }

  getRecentFiles(): Promise<RecentFile[]> {
    return this.api.getRecentFiles();
  }

  addRecentFile(path: string): Promise<void> {
    return this.api.addRecentFile(path);
  }

  clearRecentFiles(): Promise<void> {
    return this.api.clearRecentFiles();
  }

  getSettings(): Promise<AppSettings> {
    return this.api.getSettings();
  }

  saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    return this.api.saveSettings(settings);
  }

  getAppVersion(): Promise<string> {
    return this.api.getAppVersion();
  }

  searchFolder(path: string, query: string): Promise<FolderSearchResult[]> {
    return this.api.searchFolder(path, query);
  }

  onFileChanged(callback: (path: string) => void): void {
    this.api.onFileChanged(callback);
  }

  removeFileChangedListener(): void {
    this.api.removeFileChangedListener();
  }

  onMenuEvent(event: string, callback: (payload?: unknown) => void): () => void {
    return this.api.onMenuEvent(event, callback);
  }

  removeMenuListeners(): void {
    this.api.removeMenuListeners();
  }

  onOpenFilePath(callback: (path: string) => void): void {
    this.api.onOpenFilePath(callback);
  }

  removeOpenFilePathListener(): void {
    this.api.removeOpenFilePathListener();
  }

  showSaveDialog(options?: { defaultExt?: string; defaultPath?: string }): Promise<string | null> {
    return this.api.showSaveDialog(options);
  }

  exportHTML(html: string, css: string, outputPath: string): Promise<void> {
    return this.api.exportHTML(html, css, outputPath);
  }

  exportPDF(html: string, css: string, outputPath: string): Promise<void> {
    return this.api.exportPDF(html, css, outputPath);
  }

  exportDOCX(html: string, css: string, outputPath: string): Promise<void> {
    return this.api.exportDOCX(html, css, outputPath);
  }

  getPathForFile(file: File): string {
    return this.api.getPathForFile(file);
  }

  onUpdateAvailable(callback: (version: string) => void): () => void {
    return this.api.onUpdateAvailable(callback);
  }

  downloadUpdate(): void {
    this.api.downloadUpdate();
  }

  async sendMessage<TResponse = unknown, TPayload = unknown>(
    _message: PlatformMessage<TPayload>
  ): Promise<TResponse> {
    throw new Error('send message is an unsupported operation in the electron runtime environment');
  }
}
