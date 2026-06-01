import { join } from 'node:path';
import { app } from 'electron';
import { MARKDOWN_FILE_PATTERN } from '../constants/path-constants';
import { fileURLToPath } from 'node:url';
export function getRecentFilePath(): string {
  return join(app.getPath('userData'), 'recent.json');
}

export function isMarkdownFile(fileName: string): boolean {
  return MARKDOWN_FILE_PATTERN.test(fileName);
}

export function normaliseImagePath(src: string): string {
  if (src.startsWith('file://')) {
    return fileURLToPath(src);
  }
  return src;
}
