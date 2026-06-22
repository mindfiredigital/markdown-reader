import { RecentFile } from '@package/shared-types';
import { createRecentFile } from './createRecentFile';
import { getUniqueRecentFile } from './getUniqueRecentFile';

export async function addToRecentList(
  files: RecentFile[],
  filePath: string
): Promise<RecentFile[]> {
  const nextFile = await createRecentFile(filePath);
  const noDuplicate = files.filter((file) => file.path !== filePath);
  return getUniqueRecentFile([nextFile, ...noDuplicate]);
}
