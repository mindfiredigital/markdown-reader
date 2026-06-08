import { once } from 'node:events';
import { BrowserWindow } from 'electron';
import { writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildDocument } from './buildDocument';
import { sanitizeCss } from './sanitizeCss';
import { inlineImages } from './inlineImage';

export async function exportPDF(bodyHtml: string, css: string, outputPath: string): Promise<void> {
  const pdfWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      sandbox: true,
    },
  });
  const tempFilePath = join(
    tmpdir(),
    `pdf-export-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.html`
  );
  try {
    const htmlWithInlineImages = await inlineImages(bodyHtml);
    const html = buildDocument(htmlWithInlineImages, sanitizeCss(css));

    await writeFile(tempFilePath, html, 'utf8');
    await pdfWindow.loadFile(tempFilePath);

    await pdfWindow.webContents.executeJavaScript(`
      new Promise((resolve) => {
        if (document.fonts?.ready) {
          document.fonts.ready.then(resolve);
        } else {
          resolve();
        }
      });
    `);

    const pdfBuffer = await pdfWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      margins: {
        marginType: 'custom',
        top: 0.4,
        bottom: 0.4,
        left: 0.4,
        right: 0.4,
      },
    });
    await writeFile(outputPath, pdfBuffer);
  } finally {
    const closed = pdfWindow.isDestroyed()
      ? Promise.resolve()
      : once(pdfWindow, 'closed').then(() => undefined);
    if (!pdfWindow.isDestroyed()) {
      pdfWindow.close();
    }
    await closed;
    try {
      await rm(tempFilePath, { force: true });
    } catch (error) {
      console.error('Failed to clean up PDF export temp file:', error);
    }
  }
}
