import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { MAX_FOLDER_DEPTH, MAX_RESULTS } from '../constants/folder-constants';
import { MARKDOWN_FILE_PATTERN } from '@package/shared-constants';

/*It finds and collects Markdown file paths up to depth and result limits */
export async function collectMarkdownFiles(
  folderPath: string,
  files: string[] = [],
  currentDepth = 0
): Promise<string[]> {
  if (currentDepth >= MAX_FOLDER_DEPTH || files.length >= MAX_RESULTS) return files;

  let entries;
  try {
    entries = await readdir(folderPath, { withFileTypes: true });
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === 'ENOENT' || code === 'EACCES' || code === 'EPERM') return files;
    throw error;
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.isSymbolicLink()) continue;
    const fullPath = join(folderPath, entry.name);
    if (entry.isDirectory()) {
      await collectMarkdownFiles(fullPath, files, currentDepth + 1);
    } else if (MARKDOWN_FILE_PATTERN.test(entry.name)) {
      files.push(fullPath);
    }
    if (files.length >= MAX_RESULTS) break;
  }

  return files;
}
