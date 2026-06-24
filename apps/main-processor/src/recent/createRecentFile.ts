import { basename } from 'node:path';
import { RecentFile } from '@package/shared-types';
import { stat } from 'node:fs/promises';

export async function createRecentFile(filePath: string): Promise<RecentFile> {
  let size: number | undefined;
  try {
    const stats = await stat(filePath);
    size = stats.size;
  } catch {
    // ignore error if file does not exist
  }
  return {
    path: filePath,
    name: basename(filePath),
    openedAt: Date.now(),
    ...(size !== undefined ? { size } : {}),
  };
}
