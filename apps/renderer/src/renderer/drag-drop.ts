import { ElectronFile } from '../types/component-types';
import { MARKDOWN_FILE_PATTERN } from '@package/shared-constants';
import { MarkdownReaderAPI } from '@package/shared-types';
export function extractDroppedMdpath(
  dt: DataTransfer,
  api: Partial<MarkdownReaderAPI>
): string | null {
  if (!dt.files || dt.files.length === 0) return null;
  const files = Array.from(dt.files) as ElectronFile[];
  for (const f of files) {
    if (!f || !MARKDOWN_FILE_PATTERN.test(f.name)) {
      continue;
    }
    if (f.path) {
      return f.path;
    }
    const filePath = api.getPathForFile?.(f);
    if (filePath) {
      return filePath;
    }
  }
  return null;
}
