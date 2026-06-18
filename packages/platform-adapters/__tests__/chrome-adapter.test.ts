import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_SETTINGS } from '@package/shared-types';
import { ChromeAdapter } from '../src/adapters/chrome-adapter.js';
import {
  CHROME_MESSAGE_TYPES,
  DEFAULT_APP_VERSION,
  STORAGE_KEYS,
} from '../src/utils/constants/adapter-constants.js';
import { makeChromeApi } from './test-utils.js';

describe('chrome adapter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T10:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not start without chrome runtime and storage', () => {
    expect(() => new ChromeAdapter(null)).toThrow(
      'ChromeAdapter requires chrome.runtime and chrome.storage.local.'
    );
  });

  it('should store simple values in chrome local storage', async () => {
    const { api } = makeChromeApi();
    const adapter = new ChromeAdapter(api);

    await adapter.storage.setItem('theme', 'github-dark');

    expect(await adapter.storage.getItem('theme')).toBe('github-dark');
  });

  it('should remove and clear stored values', async () => {
    const { api } = makeChromeApi({ theme: 'github-dark', zoom: 18 });
    const adapter = new ChromeAdapter(api);

    await adapter.storage.removeItem('theme');
    expect(await adapter.storage.getItem('theme')).toBeNull();

    await adapter.storage.clear();
    expect(await adapter.storage.getItem('zoom')).toBeNull();
  });

  it('should keep the latest recent file first without duplicate', async () => {
    const { api } = makeChromeApi({
      [STORAGE_KEYS.RECENT_FILES]: [
        { path: 'old.md', name: 'old.md', openedAt: 1 },
        { path: 'notes.md', name: 'notes.md', openedAt: 2 },
      ],
    });
    const adapter = new ChromeAdapter(api);

    await adapter.addRecentFile('notes.md');

    expect(await adapter.getRecentFiles()).toEqual([
      { path: 'notes.md', name: 'notes.md', openedAt: Date.now() },
      { path: 'old.md', name: 'old.md', openedAt: 1 },
    ]);
  });

  it('should fill missing settings from defaults', async () => {
    const { api } = makeChromeApi({
      [STORAGE_KEYS.SETTINGS]: { theme: 'github-dark' },
    });
    const adapter = new ChromeAdapter(api);

    expect(await adapter.getSettings()).toEqual({
      ...DEFAULT_SETTINGS,
      theme: 'github-dark',
    });
  });

  it('should save settings back to chrome storage', async () => {
    const { api } = makeChromeApi({
      [STORAGE_KEYS.SETTINGS]: { theme: 'github-light', fontSize: 16 },
    });
    const adapter = new ChromeAdapter(api);

    const saved = await adapter.saveSettings({ theme: 'github-dark' });

    expect(saved.theme).toBe('github-dark');
    expect(await adapter.storage.getItem(STORAGE_KEYS.SETTINGS)).toEqual(saved);
  });

  it('should clear recent files', async () => {
    const { api } = makeChromeApi({
      [STORAGE_KEYS.RECENT_FILES]: [{ path: 'notes.md', name: 'notes.md', openedAt: 1 }],
    });
    const adapter = new ChromeAdapter(api);

    await adapter.clearRecentFiles();

    expect(await adapter.getRecentFiles()).toEqual([]);
  });

  it('chooses cached file content before the worker', async () => {
    const { api } = makeChromeApi({
      [`${STORAGE_KEYS.FILE_CONTENT_PREFIX}cached.md`]: '# Cached',
    });
    const adapter = new ChromeAdapter(api);

    expect(await adapter.readFile('cached.md')).toBe('# Cached');
    expect(api.runtime?.sendMessage).not.toHaveBeenCalled();
  });

  it('opens a markdown file with the browser file picker', async () => {
    vi.useRealTimers();
    const { api } = makeChromeApi();
    const adapter = new ChromeAdapter(api);

    const filePathPromise = adapter.openFileDialog();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['# Picked'], 'picked.md', { type: 'text/markdown' });

    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));

    await expect(filePathPromise).resolves.toBe('picked.md');
    await expect(adapter.readFile('picked.md')).resolves.toBe('# Picked');
  });

  it('returns null when the file picker is cancelled', async () => {
    const { api } = makeChromeApi();
    const adapter = new ChromeAdapter(api);

    const filePathPromise = adapter.openFileDialog();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    Object.defineProperty(input, 'files', { value: [] });
    input.dispatchEvent(new Event('change'));

    await expect(filePathPromise).resolves.toBeNull();
  });

  it('forward file changed events', () => {
    const { api, listeners } = makeChromeApi();
    const adapter = new ChromeAdapter(api);
    const onChange = vi.fn();

    adapter.onFileChanged(onChange);
    listeners.forEach((listener) => listener({ type: 'file-changed', payload: 'notes.md' }));

    expect(onChange).toHaveBeenCalledWith('notes.md');

    adapter.removeFileChangedListener();
    expect(api.runtime?.onMessage?.removeListener).toHaveBeenCalled();
  });

  it('forward menu events and removes them later', () => {
    const { api, listeners } = makeChromeApi();
    const adapter = new ChromeAdapter(api);
    const onOpen = vi.fn();

    const cleanup = adapter.onMenuEvent('open-file', onOpen);
    listeners.forEach((listener) => listener({ type: 'open-file', payload: { source: 'menu' } }));

    expect(onOpen).toHaveBeenCalledWith({ source: 'menu' });

    cleanup();
    expect(api.runtime?.onMessage?.removeListener).toHaveBeenCalled();
  });

  it('removes all registered menu listener', () => {
    const { api } = makeChromeApi();
    const adapter = new ChromeAdapter(api);

    adapter.onMenuEvent('open-file', vi.fn());
    adapter.onMenuEvent('toggle-theme', vi.fn());
    adapter.removeMenuListeners();

    expect(api.runtime?.onMessage?.removeListener).toHaveBeenCalledTimes(2);
  });

  it('forwards open file path events', () => {
    const { api, listeners } = makeChromeApi();
    const adapter = new ChromeAdapter(api);
    const onOpen = vi.fn();

    adapter.onOpenFilePath(onOpen);
    listeners.forEach((listener) => listener({ type: 'open-file-path', payload: 'notes.md' }));

    expect(onOpen).toHaveBeenCalledWith('notes.md');

    adapter.removeOpenFilePathListener();
    expect(api.runtime?.onMessage?.removeListener).toHaveBeenCalled();
  });

  it('uses browser friendly update and file path behavior', async () => {
    const { api } = makeChromeApi();
    const adapter = new ChromeAdapter(api);
    const cleanup = adapter.onUpdateAvailable();

    expect(await adapter.getAppVersion()).toBe(DEFAULT_APP_VERSION);
    expect(adapter.getPathForFile(new File(['hello'], 'notes.md'))).toBe('notes.md');
    expect(cleanup()).toBeUndefined();
  });

  it('sends download update as a background message', () => {
    const { api } = makeChromeApi();
    const adapter = new ChromeAdapter(api);

    adapter.downloadUpdate();

    expect(api.runtime?.sendMessage).toHaveBeenCalledWith({
      type: CHROME_MESSAGE_TYPES.DOWNLOAD_UPDATE,
    });
  });
});
