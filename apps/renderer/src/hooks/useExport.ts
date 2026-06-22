import { useCallback } from 'react';
import { ActiveTab } from '../types/component-types';
import exportCss from '../styles/export.css?raw';
import { usePlatformAPI } from '../hooks/usePlatform';
import { buildHtmlDocument, browserDownload } from '../utils/helpers/extension-export-helper';

export function useExport(activeTab: ActiveTab) {
  const api = usePlatformAPI();
  const isExtension = api.kind === 'chrome';

  const exportHtml = useCallback(async () => {
    if (!activeTab) return;
    const css = exportCss;

    if (isExtension) {
      // Browser-native download for Chrome extension
      const fullHtml = buildHtmlDocument(activeTab.html, css);
      browserDownload(fullHtml, 'document.html', 'text/html');
      return;
    }

    // Desktop Electron path
    if (!api.showSaveDialog || !api.exportHTML) return;
    const outPath = await api.showSaveDialog({ defaultExt: 'html' });
    if (!outPath) return;
    await api.exportHTML(activeTab.html, css, outPath);
  }, [activeTab, api, isExtension]);

  const exportPdf = useCallback(async () => {
    if (!activeTab) return;

    if (isExtension) {
      // Use print dialog as PDF export in extension browser built-in
      const css = exportCss;
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;
      printWindow.document.write(buildHtmlDocument(activeTab.html, css));
      printWindow.document.close();
      printWindow.addEventListener(
        'load',
        async () => {
          try {
            await printWindow.document.fonts?.ready;
          } catch {
            // no-op: best-effort font readiness
          }
          printWindow.print();
        },
        { once: true }
      );
      printWindow.addEventListener('afterprint', () => printWindow.close(), { once: true });
      return;
    }

    // Desktop Electron path
    if (!api.showSaveDialog || !api.exportPDF) return;
    const outPath = await api.showSaveDialog({ defaultExt: 'pdf' });
    if (!outPath) return;
    const css = exportCss;
    await api.exportPDF(activeTab.html, css, outPath);
  }, [activeTab, api, isExtension]);

  const exportDocx = useCallback(async () => {
    if (!activeTab) return;

    if (isExtension) {
      // Export as HTML with .doc extension
      const css = exportCss;
      const fullHtml = buildHtmlDocument(activeTab.html, css);
      browserDownload(fullHtml, 'document.doc', 'application/msword');
      return;
    }

    // Desktop Electron path
    if (!api.showSaveDialog || !api.exportDOCX) return;
    const outPath = await api.showSaveDialog({ defaultExt: 'docx' });
    if (!outPath) return;
    const css = exportCss;
    await api.exportDOCX(activeTab.html, css, outPath);
  }, [activeTab, api, isExtension]);

  return { exportHtml, exportPdf, exportDocx };
}
