import { vi } from 'vitest';
import type { MarkdownReaderAPI } from '@package/shared-types';
import type { ChromeExtensionApi } from '../src/types/chrome-type';

type ChromeListener = (message: unknown) => void;

// shared adapter mocks
export function makeElectronApi(overrides: Partial<MarkdownReaderAPI> = {}): MarkdownReaderAPI {
  return {
    readFile: vi.fn(async () => '# Hello'),
    watchFile: vi.fn(async () => undefined),
    unWatchFile: vi.fn(async () => undefined),
    openFileDialog: vi.fn(async () => 'notes.md'),
    openFolderDialog: vi.fn(async () => 'docs'),
    readFolder: vi.fn(async () => null),
    getRecentFiles: vi.fn(async () => []),
    addRecentFile: vi.fn(async () => undefined),
    clearRecentFiles: vi.fn(async () => undefined),
    getSettings: vi.fn(async () => ({ theme: 'github-light' }) as never),
    saveSettings: vi.fn(async (settings) => settings as never),
    getAppVersion: vi.fn(async () => '1.0.0'),
    searchFolder: vi.fn(async () => []),
    onFileChanged: vi.fn(),
    removeFileChangedListener: vi.fn(),
    onMenuEvent: vi.fn(() => vi.fn()),
    removeMenuListeners: vi.fn(),
    onOpenFilePath: vi.fn(),
    removeOpenFilePathListener: vi.fn(),
    showSaveDialog: vi.fn(async () => 'export.html'),
    exportHTML: vi.fn(async () => undefined),
    exportPDF: vi.fn(async () => undefined),
    exportDOCX: vi.fn(async () => undefined),
    getPathForFile: vi.fn(() => 'dropped.md'),
    onUpdateAvailable: vi.fn(() => vi.fn()),
    downloadUpdate: vi.fn(),
    ...overrides,
  };
}

export function makeChromeApi(initialStorage: Record<string, unknown> = {}) {
  const storage = { ...initialStorage };
  const listeners = new Set<ChromeListener>();

  const api: ChromeExtensionApi = {
    runtime: {
      sendMessage: vi.fn(async () => ({ ok: true, data: undefined })),
      onMessage: {
        addListener: vi.fn((listener) => listeners.add(listener)),
        removeListener: vi.fn((listener) => listeners.delete(listener)),
      },
    },
    storage: {
      local: {
        get: vi.fn(async (key?: string | string[] | Record<string, unknown> | null) => {
          if (typeof key === 'string') {
            return { [key]: storage[key] };
          }

          return { ...storage };
        }),
        set: vi.fn(async (items: Record<string, unknown>) => {
          Object.assign(storage, items);
        }),
        remove: vi.fn(async (keys: string | string[]) => {
          for (const key of Array.isArray(keys) ? keys : [keys]) {
            delete storage[key];
          }
        }),
        clear: vi.fn(async () => {
          for (const key of Object.keys(storage)) {
            delete storage[key];
          }
        }),
      },
    },
  };

  return { api, storage, listeners };
}
