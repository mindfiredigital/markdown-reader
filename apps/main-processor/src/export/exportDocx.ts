import HTMLtoDOCX from 'html-to-docx';
import { writeFile } from 'node:fs/promises';
import { buildDocument } from './buildDocument';
import { sanitizeCss } from './sanitizeCss';

export async function exportDOCX(bodyHtml: string, css: string, outputPath: string): Promise<void> {
  const html = buildDocument(bodyHtml, sanitizeCss(css));

  const result = await HTMLtoDOCX(html, null, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
  });

  let buffer: Buffer;

  if (Buffer.isBuffer(result)) {
    buffer = result;
  } else if (result instanceof ArrayBuffer) {
    buffer = Buffer.from(result);
  } else if (typeof Blob !== 'undefined' && result instanceof Blob) {
    buffer = Buffer.from(await result.arrayBuffer());
  } else {
    buffer = Buffer.from(result as unknown as Uint8Array);
  }

  await writeFile(outputPath, buffer);
}
