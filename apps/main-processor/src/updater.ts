import { IPC_CONSTANTS } from '@package/shared-constants';
import type { BrowserWindow } from 'electron';
import { autoUpdater, type UpdateInfo } from 'electron-updater';

export function setupAutoUpdater(window: BrowserWindow): void {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info: UpdateInfo) => {
    window.webContents.send(IPC_CONSTANTS.UPDATE_AVAILABLE, info.version);
  });

  autoUpdater.on('update-downloaded', () => {
    window.webContents.send(IPC_CONSTANTS.UPDATE_DOWNLOADED);
  });

  autoUpdater.on('error', (error: Error) => {
    console.error('Auto-updater error:', error.message);
  });

  void autoUpdater.checkForUpdates().catch((error: Error) => {
    console.error('Auto-updater check failed:', error.message);
  });
}
