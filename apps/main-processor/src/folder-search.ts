import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { FolderSearchResult } from '@package/shared-types';
import { MAX_RESULTS } from './utils/constants/folder-constants';
import { collectMarkdownFiles } from './utils/helper/folder-search-helper';

/*This searches Markdown files in a folder for text matches and returns formatted results*/
export async function searchFolder(
  folderPath: string,
  query: string
): Promise<FolderSearchResult[]> {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const results: FolderSearchResult[] = [];
  const files = await collectMarkdownFiles(folderPath);

  for (const filePath of files) {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const lineText = lines[index] ?? '';
      if (!lineText.toLowerCase().includes(normalizedQuery)) continue;

      results.push({
        filePath,
        fileName: basename(filePath),
        line: index + 1,
        column: lineText.toLowerCase().indexOf(normalizedQuery) + 1,
        preview: lineText.trim().slice(0, 240),
      });

      if (results.length >= MAX_RESULTS) return results;
    }
  }

  return results;
}
