import { readFile, stat } from 'node:fs/promises';
import type { RecentFile } from '@package/shared-types';
import { getRecentFilePath } from '../utils/helper/path-helper';
import { getUniqueRecentFile } from './getUniqueRecentFile';

export async function getRecentFiles(): Promise<RecentFile[]> {
  try {
    const raw = await readFile(getRecentFilePath(), 'utf-8');
    const files = JSON.parse(raw) as RecentFile[];
    const unique = getUniqueRecentFile(files);

    // dynamically add orupdate file sizes if files exist on disk
    const filesWithStats = await Promise.all(
      unique.map(async (file) => {
        try {
          const stats = await stat(file.path);
          return { ...file, size: stats.size };
        } catch {
          return file;
        }
      })
    );
    return filesWithStats;
  } catch {
    return [];
  }
}
