import { ElectronFile } from '../types/component-types';
import { MARKDOWN_FILE_PATTERN } from '@package/shared-constants';
export function extractDroppedMdpath(dt: DataTransfer): string | null {
  if (!dt.files || dt.files.length === 0) return null;
  const files = Array.from(dt.files) as ElectronFile[];
  for (const f of files) {
    if (!f || !MARKDOWN_FILE_PATTERN.test(f.name)) {
      continue;
    }
    if (f.path) {
      return f.path;
    }
    const api = window.api as typeof window.api & {
      getPathForFile?: (file: File) => string;
    };
    const filePath = api.getPathForFile?.(f);
    if (filePath) {
      return filePath;
    }
  }
  return null;
}
