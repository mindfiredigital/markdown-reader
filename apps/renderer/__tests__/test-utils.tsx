import type { ReactNode } from 'react';
import { vi } from 'vitest';
import { DEFAULT_SETTINGS, type AppSettings } from '@package/shared-types';
import type { PlatformAdapter } from '@package/platform-adapters';
import { PlatformProvider } from '../src/context/PlatformProvider'

export function createMockPlatform(settings: AppSettings = DEFAULT_SETTINGS): PlatformAdapter {
  let savedSettings = settings;

  return {
    kind: 'electron',
    storage: {
      getItem: vi.fn(async () => null),
      setItem: vi.fn(async () => undefined),
      removeItem: vi.fn(async () => undefined),
      clear: vi.fn(async () => undefined),
    },
    readFile: vi.fn(),
    watchFile: vi.fn(),
    unWatchFile: vi.fn(),
    openFileDialog: vi.fn(),
    openFolderDialog: vi.fn(),
    readFolder: vi.fn(),
    getRecentFiles: vi.fn(),
    addRecentFile: vi.fn(),
    clearRecentFiles: vi.fn(),
    getSettings: vi.fn(async () => savedSettings),
    saveSettings: vi.fn(async (partial) => {
      savedSettings = { ...savedSettings, ...partial };
      return savedSettings;
    }),
    getAppVersion: vi.fn(),
    searchFolder: vi.fn(),
    onFileChanged: vi.fn(),
    removeFileChangedListener: vi.fn(),
    onMenuEvent: vi.fn(() => vi.fn()),
    removeMenuListeners: vi.fn(),
    onOpenFilePath: vi.fn(),
    removeOpenFilePathListener: vi.fn(),
    showSaveDialog: vi.fn(),
    exportHTML: vi.fn(),
    exportPDF: vi.fn(),
    exportDOCX: vi.fn(),
    getPathForFile: vi.fn(),
    onUpdateAvailable: vi.fn(() => vi.fn()),
    downloadUpdate: vi.fn(),
    sendMessage: vi.fn(),
  } as PlatformAdapter;
}

export function createPlatformWrapper(platform: PlatformAdapter = createMockPlatform()) {
  return function PlatformTestWrapper({ children }: { children: ReactNode }) {
    return <PlatformProvider platform={platform}>{children}</PlatformProvider>;
  };
}