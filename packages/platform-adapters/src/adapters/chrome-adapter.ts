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
  private readonly menuListeners = new Map<string, Array<(message: unknown) => void>>();
  private readonly transientFiles = new Set<string>();

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
            const path = `[${file.size}:${file.lastModified}]/${file.name}`;
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
                this.transientFiles.add(path);
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
      input.addEventListener(
        'cancel',
        () => {
          input.remove();
          resolve(null);
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
    if (this.transientFiles.has(path)) {
      return;
    }
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
    if (this.fileChangedListener) {
      this.chromeApi.runtime?.onMessage?.removeListener(this.fileChangedListener);
    }
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

    const listeners = this.menuListeners.get(event) || [];
    listeners.push(listener);
    this.menuListeners.set(event, listeners);

    this.chromeApi.runtime?.onMessage?.addListener(listener);
    return () => {
      this.chromeApi.runtime?.onMessage?.removeListener(listener);
      const updated = this.menuListeners.get(event)?.filter((l) => l !== listener) || [];
      if (updated.length === 0) {
        this.menuListeners.delete(event);
      } else {
        this.menuListeners.set(event, updated);
      }
    };
  }

  removeMenuListeners(): void {
    this.menuListeners.forEach((listeners) => {
      listeners.forEach((listener) => {
        this.chromeApi.runtime?.onMessage?.removeListener(listener);
      });
    });
    this.menuListeners.clear();
  }

  onOpenFilePath(callback: (path: string) => void): void {
    if (this.openFilePathListener) {
      this.chromeApi.runtime?.onMessage?.removeListener(this.openFilePathListener);
    }
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

  exportHTML(html: string, css: string, outputPath: string): Promise<void> {
    const fullHtml = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<style>\n${css}\n</style>\n</head>\n<body>\n${html}\n</body>\n</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // fallback naming block if outputPath is an empty string
    const targetName = outputPath ? outputPath.split(/[\\/]/).pop() || outputPath : 'document';
    const cleanFilename = targetName.includes('/')
      ? targetName.split('/').pop() || 'document'
      : targetName;
    a.download = cleanFilename.endsWith('.html') ? cleanFilename : `${cleanFilename}.html`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return Promise.resolve();
  }

  exportPDF(html: string, css: string, outputPath: string): Promise<void> {
    const fullHtml = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<style>\n${css}\n</style>\n</head>\n<body>\n${html}\n</body>\n</html>`;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return Promise.resolve();
    printWindow.document.write(fullHtml);
    printWindow.document.close();

    let printed = false;
    const doPrint = async () => {
      if (printed) return;
      printed = true;
      try {
        await printWindow.document.fonts?.ready;
      } catch {
        // best-effort
      }
      printWindow.print();
    };

    printWindow.addEventListener('load', doPrint, { once: true });
    setTimeout(doPrint, 500);

    printWindow.addEventListener('afterprint', () => printWindow.close(), { once: true });
    return Promise.resolve();
  }

  getPathForFile(file: File): string {
    return file.name;
  }

  onUpdateAvailable(): () => void {
    return () => {};
  }

  downloadUpdate(): void {
    createUnsupportedPlatformMethod('downloadUpdate');
  }

  async sendMessage<TResponse = unknown, TPayload = unknown>(
    message: PlatformMessage<TPayload>
  ): Promise<TResponse> {
    const runtime = this.chromeApi.runtime;
    if (!runtime?.sendMessage) createUnsupportedPlatformMethod('chrome.runtime.sendMessage');

    const response = await runtime.sendMessage<ChromeMessageResponse<TResponse>>(message);
    if (!response) {
      throw new Error(
        `No response received for message type "${message.type}". ` +
          'The background listener may not be active.'
      );
    }
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
