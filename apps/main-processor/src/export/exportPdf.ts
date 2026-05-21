import { BrowserWindow } from 'electron';
import { writeFile } from 'node:fs/promises';
import { buildDocument } from './buildDocument';
import { sanitizeCss } from './sanitizeCss';

export async function exportPDF(bodyHtml: string, css: string, outputPath: string): Promise<void> {
  const pdfWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      sandbox: false,
    },
  });

  try {
    const html = buildDocument(bodyHtml, sanitizeCss(css));

    await pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

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
    pdfWindow.close();
  }
}
