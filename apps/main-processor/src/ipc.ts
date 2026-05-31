import { ipcMain, dialog } from 'electron';
import { readFile, unWatchFile, watchFile } from './file';
import { getFolder } from './folder';
import { validatePath, validateSender, allowedFolderRoots } from './utils/constants/ipc-validation';
import { IPC_CONSTANTS } from '@package/shared-constants';
import { getRecentFiles } from './recent/getRecentFile';
import { addRecentFile } from './recent/addRecentFile';
import { exportHTML } from './export/exportHtml';
import { exportPDF } from './export/exportPdf';
import { exportDOCX } from './export/exportDocx';
import {
  resolveMarkdownFilePath,
  resolveDirectoryPath,
  resolveWatchedMarkdownPath,
} from './utils/helper/ipc-path-resolver';
import { searchFolder } from './folder-search';

//registers all IPC handlers for main process
export function registerIPCHandlers(): void {
  //returns text content of the file
  ipcMain.handle(IPC_CONSTANTS.READ_FILE, async (event, filePath: string) => {
    if (!validateSender(event)) {
      throw new Error('Untrusted sender');
    }
    const safeFilePath = await resolveMarkdownFilePath(filePath);
    return await readFile(safeFilePath);
  });

  // opens the file path
  ipcMain.handle(IPC_CONSTANTS.OPEN_FILE_DIALOG, async (event) => {
    if (!validateSender(event)) {
      throw new Error('Untrusted sender');
    }
    const result = await dialog.showOpenDialog({
      title: 'Open Markdown File',
      filters: [
        { name: 'Markdown Files', extensions: ['md', 'markdown'] },
        { name: 'All Files', extensions: ['*'] },
      ],
      properties: ['openFile'],
    });
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    const selected = result.filePaths[0];
    if (!selected) return null;
    return await resolveMarkdownFilePath(selected);
  });

  // watches a file
  ipcMain.handle(IPC_CONSTANTS.WATCH_FILE, async (event, filePath: string) => {
    if (!validateSender(event)) {
      throw new Error('Untrusted sender');
    }
    const safeFilePath = await resolveWatchedMarkdownPath(filePath);
    await watchFile(safeFilePath, () => {
      event.sender.send(IPC_CONSTANTS.FILE_CHANGED, safeFilePath);
    });
  });

  //un watch file
  ipcMain.handle(IPC_CONSTANTS.UNWATCH_FILE, async (event, filePath: string) => {
    if (!validateSender(event)) {
      throw new Error('Untrusted sender');
    }
    const safeFilePath = await resolveMarkdownFilePath(filePath);
    await unWatchFile(safeFilePath);
  });

  //get recent files
  ipcMain.handle(IPC_CONSTANTS.GET_RECENT_FILES, async (event) => {
    if (!validateSender(event)) {
      throw new Error('Untrusted sender');
    }
    return await getRecentFiles();
  });

  // add recent files
  ipcMain.handle(IPC_CONSTANTS.ADD_RECENT_FILES, async (event, filePath: string) => {
    if (!validateSender(event)) {
      throw new Error('Untrusted sender');
    }
    const safeFilePath = await resolveMarkdownFilePath(filePath);
    await addRecentFile(safeFilePath);
  });

  ipcMain.handle(IPC_CONSTANTS.OPEN_FOLDER_DIALOG, async (event) => {
    if (!validateSender(event)) {
      throw new Error('Untrusted sender');
    }

    const result = await dialog.showOpenDialog({
      title: 'Open Folder',
      properties: ['openDirectory'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    if (!result.filePaths[0]) return null;
    const safeFolderPath = await resolveDirectoryPath(result.filePaths[0]);
    allowedFolderRoots.add(safeFolderPath);
    return safeFolderPath;
  });

  ipcMain.handle(IPC_CONSTANTS.READ_FOLDER, async (event, folderPath: string) => {
    if (!validateSender(event)) {
      throw new Error('Untrusted sender');
    }

    const safeFolderPath = await resolveDirectoryPath(folderPath);
    allowedFolderRoots.add(safeFolderPath);
    return await getFolder(safeFolderPath);
  });

  ipcMain.handle(
    IPC_CONSTANTS.EXPORT_HTML,
    async (event, html: string, css: string, outPath: string) => {
      if (!validateSender(event)) {
        throw new Error('Untrusted sender');
      }

      if (!validatePath(outPath)) {
        throw new Error('Invalid folder path');
      }
      await exportHTML(html, css, outPath);
    }
  );

  ipcMain.handle(IPC_CONSTANTS.SHOW_SAVE_DIALOG, async (event, opts: { defaultExt: string }) => {
    if (!validateSender(event)) {
      throw new Error('Untrusted sender');
    }
    const result = await dialog.showSaveDialog({
      filters: [
        {
          name: opts.defaultExt.toUpperCase() + ' File',
          extensions: [opts.defaultExt],
        },
      ],
    });
    return result.canceled ? null : result.filePath;
  });

  ipcMain.handle(
    IPC_CONSTANTS.EXPORT_PDF,
    async (event, html: string, css: string, outPath: string) => {
      if (!validateSender(event)) {
        throw new Error('Untrusted sender');
      }

      if (!validatePath(outPath)) {
        throw new Error('Invalid folder path');
      }
      await exportPDF(html, css, outPath);
    }
  );

  ipcMain.handle(
    IPC_CONSTANTS.EXPORT_DOCX,
    async (event, html: string, css: string, outPath: string) => {
      if (!validateSender(event)) {
        throw new Error('Untrusted sender');
      }

      if (!validatePath(outPath)) {
        throw new Error('Invalid folder path');
      }
      await exportDOCX(html, css, outPath);
    }
  );

  ipcMain.handle(IPC_CONSTANTS.SEARCH_FOLDER, async (event, folderPath: string, query: string) => {
    if (!validateSender(event)) {
      throw new Error('Untrusted sender');
    }

    const safeFolderPath = await resolveDirectoryPath(folderPath);
    allowedFolderRoots.add(safeFolderPath);
    const isAllowed = Array.from(allowedFolderRoots).some(
      (root) => safeFolderPath === root || safeFolderPath.startsWith(`${root}/`)
    );
    if (!isAllowed) {
      throw new Error('Folder path is not authorized');
    }
    return await searchFolder(safeFolderPath, query);
  });
}
