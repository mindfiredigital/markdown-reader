import { getChromeApi } from '../helpers/adapter-helper';
export const PLATFORM_KIND = {
  ELECTRON: 'electron',
  CHROME: 'chrome',
} as const;

export const STORAGE_KEYS = {
  SETTINGS: 'markdown-reader:settings',
  RECENT_FILES: 'markdown-reader:recent-files',
  FILE_CONTENT_PREFIX: 'markdown-reader:file-content:',
} as const;

export const CHROME_MESSAGE_TYPES = {
  READ_FILE: 'markdown-reader:read-file',
  OPEN_FILE_DIALOG: 'markdown-reader:open-file-dialog',
  OPEN_FOLDER_DIALOG: 'markdown-reader:open-folder-dialog',
  READ_FOLDER: 'markdown-reader:read-folder',
  SEARCH_FOLDER: 'markdown-reader:search-folder',
  WATCH_FILE: 'markdown-reader:watch-file',
  UNWATCH_FILE: 'markdown-reader:unwatch-file',
  SHOW_SAVE_DIALOG: 'markdown-reader:show-save-dialog',
  EXPORT_HTML: 'markdown-reader:export-html',
  EXPORT_PDF: 'markdown-reader:export-pdf',
  EXPORT_DOCX: 'markdown-reader:export-docx',
  DOWNLOAD_UPDATE: 'markdown-reader:download-update',
} as const;

const chromeApi = getChromeApi();
export const DEFAULT_APP_VERSION =
  chromeApi?.runtime?.getManifest?.()?.version ?? '1.0.0-extension';
