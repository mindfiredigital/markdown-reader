import { describe, expect, it, vi } from 'vitest';
import { ElectronAdapter } from '../src/adapters/electron-adapter.js';
import { PLATFORM_KIND } from '../src/utils/constants/adapter-constants.js';
import { makeElectronApi } from './test-utils.js';

describe('electron adapter', () => {
  it('should fail when preload api is not available', () => {
    expect(() => new ElectronAdapter(null)).toThrow('ElectronAdapter requires window.api');
  });

  it('should read a file through the electron bridge', async () => {
    const api = makeElectronApi();
    const adapter = new ElectronAdapter(api);

    const content = await adapter.readFile('notes.md');

    expect(content).toBe('# Hello');
    expect(adapter.kind).toBe(PLATFORM_KIND.ELECTRON);
    expect(api.readFile).toHaveBeenCalledWith('notes.md');
  });

  it('should pass settings changes to the desktop api', async () => {
    const api = makeElectronApi();
    const adapter = new ElectronAdapter(api);

    const saved = await adapter.saveSettings({ theme: 'github-dark' });

    expect(saved).toEqual({ theme: 'github-dark' });
    expect(api.saveSettings).toHaveBeenCalledWith({ theme: 'github-dark' });
  });

  it('should pass common file actions to the desktop api', async () => {
    const api = makeElectronApi();
    const adapter = new ElectronAdapter(api);

    await adapter.openFileDialog();
    await adapter.openFolderDialog();
    await adapter.readFolder('docs');
    await adapter.watchFile('notes.md');
    await adapter.unWatchFile('notes.md');

    expect(api.openFileDialog).toHaveBeenCalled();
    expect(api.openFolderDialog).toHaveBeenCalled();
    expect(api.readFolder).toHaveBeenCalledWith('docs');
    expect(api.watchFile).toHaveBeenCalledWith('notes.md');
    expect(api.unWatchFile).toHaveBeenCalledWith('notes.md');
  });

  it('should pass recent file actions to the desktop api', async () => {
    const api = makeElectronApi();
    const adapter = new ElectronAdapter(api);

    await adapter.getRecentFiles();
    await adapter.addRecentFile('notes.md');
    await adapter.clearRecentFiles();

    expect(api.getRecentFiles).toHaveBeenCalled();
    expect(api.addRecentFile).toHaveBeenCalledWith('notes.md');
    expect(api.clearRecentFiles).toHaveBeenCalled();
  });

  it('should pass search and listener actions to the desktop api', async () => {
    const api = makeElectronApi();
    const adapter = new ElectronAdapter(api);
    const onFileChanged = vi.fn();
    const onOpenPath = vi.fn();

    await adapter.searchFolder('docs', 'hello');
    adapter.onFileChanged(onFileChanged);
    adapter.removeFileChangedListener();
    adapter.onOpenFilePath(onOpenPath);
    adapter.removeOpenFilePathListener();
    adapter.removeMenuListeners();

    expect(api.searchFolder).toHaveBeenCalledWith('docs', 'hello');
    expect(api.onFileChanged).toHaveBeenCalledWith(onFileChanged);
    expect(api.removeFileChangedListener).toHaveBeenCalled();
    expect(api.onOpenFilePath).toHaveBeenCalledWith(onOpenPath);
    expect(api.removeOpenFilePathListener).toHaveBeenCalled();
    expect(api.removeMenuListeners).toHaveBeenCalled();
  });

  it('should pass export actions to the desktop api', async () => {
    const api = makeElectronApi();
    const adapter = new ElectronAdapter(api);

    await adapter.showSaveDialog({ defaultExt: 'html' });
    await adapter.exportHTML('<h1>Hello</h1>', 'body{}', 'out.html');
    await adapter.exportPDF('<h1>Hello</h1>', 'body{}', 'out.pdf');
    await adapter.exportDOCX('<h1>Hello</h1>', 'body{}', 'out.docx');

    expect(api.showSaveDialog).toHaveBeenCalledWith({ defaultExt: 'html' });
    expect(api.exportHTML).toHaveBeenCalledWith('<h1>Hello</h1>', 'body{}', 'out.html');
    expect(api.exportPDF).toHaveBeenCalledWith('<h1>Hello</h1>', 'body{}', 'out.pdf');
    expect(api.exportDOCX).toHaveBeenCalledWith('<h1>Hello</h1>', 'body{}', 'out.docx');
  });

  it('should pass update and path helpers to the desktop api', async () => {
    const api = makeElectronApi();
    const adapter = new ElectronAdapter(api);
    const file = new File(['hello'], 'dropped.md');
    const onUpdate = vi.fn();

    await adapter.getAppVersion();
    adapter.getPathForFile(file);
    adapter.onUpdateAvailable(onUpdate);
    adapter.downloadUpdate();

    expect(api.getAppVersion).toHaveBeenCalled();
    expect(api.getPathForFile).toHaveBeenCalledWith(file);
    expect(api.onUpdateAvailable).toHaveBeenCalledWith(onUpdate);
    expect(api.downloadUpdate).toHaveBeenCalled();
  });

  it('should keep menu cleanup by electron', () => {
    const cleanup = vi.fn();
    const api = makeElectronApi({
      onMenuEvent: vi.fn(() => cleanup),
    });
    const adapter = new ElectronAdapter(api);

    const returnedCleanup = adapter.onMenuEvent('open-file', vi.fn());

    expect(returnedCleanup).toBe(cleanup);
  });

  it('should return the message object for generic messages', async () => {
    const adapter = new ElectronAdapter(makeElectronApi());
    const message = { type: 'ping', payload: { ok: true } };

    await expect(adapter.sendMessage(message)).resolves.toBe(message);
  });
});
