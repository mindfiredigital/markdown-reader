import { DEFAULT_SETTINGS } from '@package/shared-types';
import type { AppSettings, FileType, FolderSearchResult, RecentFile } from '@package/shared-types';
import {
  CHROME_MESSAGE_TYPES,
  DEFAULT_APP_VERSION,
  PLATFORM_KIND,
  STORAGE_KEYS,
} from '../utils/constants/adapter-constants';
import { createUnsupportedPlatformMethod, getChromeApi } from '../utils/helpers/adapter-helper';
import type { PlatformAdapter, PlatformMessage } from '../types/platform-type';
import type { StorageAdapter } from '../types/storage-type';
import type {
  ChromeMessageResponse,
  ChromeExtensionApi,
  ChromeRuntimeEvent,
} from '../types/chrome-type';

class ChromeStorageAdapter implements StorageAdapter {
  constructor(private readonly chromeApi: ChromeExtensionApi) {}

  async getItem<T>(key: string): Promise<T | null> {
    const area = this.chromeApi.storage?.local;
    if (!area) createUnsupportedPlatformMethod('chrome.storage.local.get');

    const result = await area.get(key);
    return (result[key] as T | undefined) ?? null;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    const area = this.chromeApi.storage?.local;
    if (!area) createUnsupportedPlatformMethod('chrome.storage.local.set');

    await area.set({ [key]: value });
  }

  async removeItem(key: string): Promise<void> {
    const area = this.chromeApi.storage?.local;
    if (!area) createUnsupportedPlatformMethod('chrome.storage.local.remove');

    await area.remove(key);
  }

  async clear(): Promise<void> {
    const area = this.chromeApi.storage?.local;
    if (!area) createUnsupportedPlatformMethod('chrome.storage.local.clear');

    await area.clear();
  }
}

export class ChromeAdapter implements PlatformAdapter {
  readonly kind = PLATFORM_KIND.CHROME;
  readonly storage: StorageAdapter;
  private readonly chromeApi: ChromeExtensionApi;
  private readonly openedFiles = new Map<string, string>();
  private fileChangedListener: ((message: unknown) => void) | null = null;
  private openFilePathListener: ((message: unknown) => void) | null = null;
  private readonly menuListeners = new Map<string, (message: unknown) => void>();

  constructor(chromeApi: ChromeExtensionApi | null = getChromeApi()) {
    if (!chromeApi?.runtime?.sendMessage || !chromeApi.storage?.local) {
      throw new Error('ChromeAdapter requires chrome.runtime and chrome.storage.local.');
    }

    this.chromeApi = chromeApi;
    this.storage = new ChromeStorageAdapter(chromeApi);
  }

  async readFile(path: string): Promise<string> {
    const inMemoryContent = this.openedFiles.get(path);
    if (inMemoryContent !== undefined) {
      return inMemoryContent;
    }

    const storedContent = await this.storage.getItem<string>(
      `${STORAGE_KEYS.FILE_CONTENT_PREFIX}${path}`
    );
    if (storedContent !== null) {
      this.openedFiles.set(path, storedContent);
      return storedContent;
    }

    return this.sendMessage<string>({
      type: CHROME_MESSAGE_TYPES.READ_FILE,
      payload: { path },
    });
  }

  async watchFile(): Promise<void> {
    return undefined;
  }

  async unWatchFile(): Promise<void> {
    return undefined;
  }

  async openFileDialog(): Promise<string | null> {
    if (typeof document === 'undefined') {
      return this.sendMessage<string | null>({
        type: CHROME_MESSAGE_TYPES.OPEN_FILE_DIALOG,
      });
    }

    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.md,.markdown,text/markdown,text/plain';
      input.style.display = 'none';

      input.addEventListener(
        'change',
        () => {
          const file = input.files?.[0];
          input.remove();

          if (!file) {
            resolve(null);
            return;
          }

          const reader = new FileReader();
          reader.onload = async () => {
            const content = String(reader.result ?? '');
            const path = file.name;
            this.openedFiles.set(path, content);
            try {
              await this.storage.setItem(`${STORAGE_KEYS.FILE_CONTENT_PREFIX}${path}`, content);
            } catch (error: unknown) {
              const errorMessage = error instanceof Error ? error.message : '';
              const errorName =
                typeof error === 'object' && error !== null && 'name' in error
                  ? String((error as Record<string, unknown>).name)
                  : '';

              if (errorMessage.includes('QUOTA_BYTES') || errorName === 'QuotaExceededError') {
                console.warn(
                  'Extension storage limit (10MB) exceeded. File opened for this session but not persisted.'
                );
              } else {
                console.warn(
                  error instanceof Error ? error : new Error('Failed to cache file content.')
                );
              }
            }
            resolve(path);
          };
          reader.onerror = () => {
            reject(reader.error ?? new Error('Failed to read selected Markdown file.'));
          };
          reader.readAsText(file);
        },
        { once: true }
      );

      document.body.appendChild(input);
      input.click();
    });
  }

  openFolderDialog(): Promise<string | null> {
    return this.sendMessage<string | null>({
      type: CHROME_MESSAGE_TYPES.OPEN_FOLDER_DIALOG,
    });
  }

  readFolder(path: string): Promise<FileType | null> {
    return this.sendMessage<FileType | null>({
      type: CHROME_MESSAGE_TYPES.READ_FOLDER,
      payload: { path },
    });
  }

  async getRecentFiles(): Promise<RecentFile[]> {
    return (await this.storage.getItem<RecentFile[]>(STORAGE_KEYS.RECENT_FILES)) ?? [];
  }

  async addRecentFile(path: string): Promise<void> {
    const recentFiles = await this.getRecentFiles();
    const content = this.openedFiles.get(path);

    const next: RecentFile[] = [
      {
        path,
        name: path.split(/[\\/]/).pop() || path,
        openedAt: Date.now(),
        ...(content !== undefined ? { size: new TextEncoder().encode(content).length } : {}),
      },
      ...recentFiles.filter((file) => file.path !== path),
    ];

    await this.storage.setItem(
      STORAGE_KEYS.RECENT_FILES,
      next.slice(0, DEFAULT_SETTINGS.recentFilesLimit)
    );
  }

  clearRecentFiles(): Promise<void> {
    return this.storage.setItem(STORAGE_KEYS.RECENT_FILES, []);
  }

  async getSettings(): Promise<AppSettings> {
    const stored = await this.storage.getItem<Partial<AppSettings>>(STORAGE_KEYS.SETTINGS);
    return { ...DEFAULT_SETTINGS, ...stored };
  }

  async saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const next = { ...(await this.getSettings()), ...settings };
    await this.storage.setItem(STORAGE_KEYS.SETTINGS, next);
    return next;
  }

  async getAppVersion(): Promise<string> {
    const version = this.chromeApi?.runtime?.getManifest?.()?.version;
    return version ?? DEFAULT_APP_VERSION;
  }

  searchFolder(path: string, query: string): Promise<FolderSearchResult[]> {
    return this.sendMessage<FolderSearchResult[]>({
      type: CHROME_MESSAGE_TYPES.SEARCH_FOLDER,
      payload: { path, query },
    });
  }

  onFileChanged(callback: (path: string) => void): void {
    this.fileChangedListener = (message) => {
      if (isRuntimeEvent(message, 'file-changed') && typeof message.payload === 'string') {
        callback(message.payload);
      }
    };
    this.chromeApi.runtime?.onMessage?.addListener(this.fileChangedListener);
  }

  removeFileChangedListener(): void {
    if (this.fileChangedListener) {
      this.chromeApi.runtime?.onMessage?.removeListener(this.fileChangedListener);
      this.fileChangedListener = null;
    }
  }

  onMenuEvent(event: string, callback: (payload?: unknown) => void): () => void {
    const listener = (message: unknown) => {
      if (isRuntimeEvent(message, event)) {
        callback(message.payload);
      }
    };

    this.menuListeners.set(event, listener);
    this.chromeApi.runtime?.onMessage?.addListener(listener);
    return () => {
      this.chromeApi.runtime?.onMessage?.removeListener(listener);
      this.menuListeners.delete(event);
    };
  }

  removeMenuListeners(): void {
    this.menuListeners.forEach((listener) => {
      this.chromeApi.runtime?.onMessage?.removeListener(listener);
    });
    this.menuListeners.clear();
  }

  onOpenFilePath(callback: (path: string) => void): void {
    this.openFilePathListener = (message) => {
      if (isRuntimeEvent(message, 'open-file-path') && typeof message.payload === 'string') {
        callback(message.payload);
      }
    };
    this.chromeApi.runtime?.onMessage?.addListener(this.openFilePathListener);
  }

  removeOpenFilePathListener(): void {
    if (this.openFilePathListener) {
      this.chromeApi.runtime?.onMessage?.removeListener(this.openFilePathListener);
      this.openFilePathListener = null;
    }
  }

  showSaveDialog(options?: { defaultExt?: string; defaultPath?: string }): Promise<string | null> {
    return this.sendMessage<string | null>({
      type: CHROME_MESSAGE_TYPES.SHOW_SAVE_DIALOG,
      payload: options,
    });
  }

  exportHTML(html: string, css: string, outputPath: string): Promise<void> {
    return this.sendMessage<void>({
      type: CHROME_MESSAGE_TYPES.EXPORT_HTML,
      payload: { html, css, outputPath },
    });
  }

  exportPDF(html: string, css: string, outputPath: string): Promise<void> {
    return this.sendMessage<void>({
      type: CHROME_MESSAGE_TYPES.EXPORT_PDF,
      payload: { html, css, outputPath },
    });
  }

  exportDOCX(html: string, css: string, outputPath: string): Promise<void> {
    return this.sendMessage<void>({
      type: CHROME_MESSAGE_TYPES.EXPORT_DOCX,
      payload: { html, css, outputPath },
    });
  }

  getPathForFile(file: File): string {
    return file.name;
  }

  onUpdateAvailable(): () => void {
    return () => {};
  }

  downloadUpdate(): void {
    this.sendMessage<void>({ type: CHROME_MESSAGE_TYPES.DOWNLOAD_UPDATE }).catch(
      (error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`Chrome adapter download update message skipped: ${message}`);
      }
    );
  }

  async sendMessage<TResponse = unknown, TPayload = unknown>(
    message: PlatformMessage<TPayload>
  ): Promise<TResponse> {
    const runtime = this.chromeApi.runtime;
    if (!runtime?.sendMessage) createUnsupportedPlatformMethod('chrome.runtime.sendMessage');

    const response = await runtime.sendMessage<ChromeMessageResponse<TResponse>>(message);
    if (!response.ok) {
      throw new Error(response.error);
    }

    return response.data;
  }
}

function isRuntimeEvent(message: unknown, type: string): message is ChromeRuntimeEvent {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    (message as { type?: unknown }).type === type
  );
}
