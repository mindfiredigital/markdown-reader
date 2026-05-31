import { readFile } from 'node:fs/promises';
import { EXPORT_CONST } from '../utils/constants/export-constants';
import { normaliseImagePath } from '../utils/helper/path-helper';
import { getImage } from './getImage';

export async function inlineImages(html: string): Promise<string> {
  const matches = [...html.matchAll(EXPORT_CONST.EXPORT_IMAGE_SRC_REGEX)];
  let output = html;

  for (const match of matches) {
    const fullMatch = match[0];
    const src = match[2];

    if (!src) continue;

    try {
      const imagePath = normaliseImagePath(src);
      const data = await readFile(imagePath);
      const mimeType = getImage(imagePath);
      const base64 = data.toString('base64');

      output = output.replace(fullMatch, `src="data:${mimeType};base64,${base64}"`);
    } catch {
      output = output.replace(fullMatch, fullMatch);
    }
  }

  return output;
}
