import { readFile, realpath } from 'node:fs/promises';
import { EXPORT_CONST } from '../utils/constants/export-constants';
import { normaliseImagePath } from '../utils/helper/path-helper';
import { getImage } from './getImage';
import {
  allowedFolderRoots,
  allowedMarkdownFiles,
  isPathInside,
} from '../utils/constants/ipc-validation';
import { dirname } from 'node:path';

export async function inlineImages(html: string): Promise<string> {
  const matches = [...html.matchAll(EXPORT_CONST.EXPORT_IMAGE_SRC_REGEX)];
  let output = html;

  for (const match of matches) {
    const fullMatch = match[0];
    const src = match[2];

    if (!src) continue;

    try {
      const imagePath = normaliseImagePath(src);
      const resolveImagePath = await realpath(imagePath);
      let isAllowed = false;
      for (const root of allowedFolderRoots) {
        if (isPathInside(resolveImagePath, root)) {
          isAllowed = true;
          break;
        }
      }
      if (!isAllowed) {
        for (const file of allowedMarkdownFiles) {
          const parentDir = dirname(file);
          if (isPathInside(resolveImagePath, parentDir)) {
            isAllowed = true;
            break;
          }
        }
      }

      if (!isAllowed) continue;
      const data = await readFile(resolveImagePath);
      const mimeType = getImage(resolveImagePath);
      const base64 = data.toString('base64');

      output = output.replace(fullMatch, `src="data:${mimeType};base64,${base64}"`);
    } catch {
      output = output.replace(fullMatch, fullMatch);
    }
  }

  return output;
}
