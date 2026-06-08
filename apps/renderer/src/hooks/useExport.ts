import { useCallback } from 'react';
import { ActiveTab } from '../types/component-types';
import exportCss from '../styles/export.css?raw';

export function useExport(activeTab: ActiveTab) {
  const exportHtml = useCallback(async () => {
    if (!activeTab) return;
    const outPath = await window.api.showSaveDialog({ defaultExt: 'html' });
    if (!outPath) return;
    const css = exportCss;
    await window.api.exportHTML(activeTab.html, css, outPath);
  }, [activeTab]);

  const exportPdf = useCallback(async () => {
    if (!activeTab) return;
    const outPath = await window.api.showSaveDialog({ defaultExt: 'pdf' });
    if (!outPath) return;
    const css = exportCss;
    await window.api.exportPDF(activeTab.html, css, outPath);
  }, [activeTab]);

  const exportDocx = useCallback(async () => {
    if (!activeTab) return;

    const outPath = await window.api.showSaveDialog({
      defaultExt: 'docx',
    });
    if (!outPath) return;
    const css = exportCss;
    await window.api.exportDOCX(activeTab.html, css, outPath);
  }, [activeTab]);

  return { exportHtml, exportPdf, exportDocx };
}
