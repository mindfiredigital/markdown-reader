import { basename } from 'node:path';
import { RecentFile } from '@package/shared-types';
import { statSync } from 'node:fs';

export function createRecentFile(filePath: string): RecentFile {
  let size: number | undefined;
  try {
    const stats = statSync(filePath);
    size = stats.size;
  } catch {
    // ignore error if file doesnot exists
  }
  return {
    path: filePath,
    name: basename(filePath),
    openedAt: Date.now(),
    ...(size !== undefined ? { size } : {}),
  };
}
