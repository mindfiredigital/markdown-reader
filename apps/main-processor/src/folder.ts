import { readdir, realpath } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { FileType } from '@package/shared-types';
import { isMarkdownFile } from './utils/helper/path-helper';
import { MAX_FOLDER_DEPTH } from './utils/constants/path-constants';

export async function getFolder(
  folderPath: string,
  maxDepth = MAX_FOLDER_DEPTH,
  currentDepth = 0,
  seenPaths = new Set<string>()
): Promise<FileType> {
  const realFolderPath = await realpath(folderPath);
  if (currentDepth >= maxDepth || seenPaths.has(realFolderPath)) {
    return {
      name: basename(folderPath),
      path: folderPath,
      isDir: true,
      children: [],
    };
  }
  seenPaths.add(realFolderPath);
  const entries = (await readdir(folderPath, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const children: FileType[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isSymbolicLink()) continue;
    const fullPath = join(folderPath, entry.name);

    if (entry.isDirectory()) {
      children.push(await getFolder(fullPath, maxDepth, currentDepth + 1, seenPaths));
      continue;
    }

    if (isMarkdownFile(entry.name)) {
      children.push({
        name: entry.name,
        path: fullPath,
        isDir: false,
      });
    }
  }

  return {
    name: basename(folderPath),
    path: folderPath,
    isDir: true,
    children,
  };
}
