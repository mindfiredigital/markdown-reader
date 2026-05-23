import { writeFile } from 'node:fs/promises';
import { buildDocument } from './buildDocument';
import { inlineImages } from './inlineImage';
import { sanitizeCss } from './sanitizeCss';

export async function exportHTML(bodyHtml: string, css: string, outputPath: string): Promise<void> {
  const safeCss = sanitizeCss(css);

  const htmlWithInlineImages = await inlineImages(bodyHtml);

  const document = buildDocument(htmlWithInlineImages, safeCss);

  await writeFile(outputPath, document, 'utf-8');
}
