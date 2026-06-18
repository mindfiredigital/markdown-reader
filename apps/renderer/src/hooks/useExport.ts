import { useCallback } from 'react';
import { ActiveTab } from '../types/component-types';
import exportCss from '../styles/export.css?raw';
import { usePlatformAPI } from '../hooks/usePlatform';

export function useExport(activeTab: ActiveTab) {
  const api = usePlatformAPI();
  const exportHtml = useCallback(async () => {
    if (!activeTab || !api.showSaveDialog || !api.exportHTML) return;
    const outPath = await api.showSaveDialog({ defaultExt: 'html' });
    if (!outPath) return;
    const css = exportCss;
    await api.exportHTML(activeTab.html, css, outPath);
  }, [activeTab, api]);

  const exportPdf = useCallback(async () => {
    if (!activeTab || !api.showSaveDialog || !api.exportPDF) return;
    const outPath = await api.showSaveDialog({ defaultExt: 'pdf' });
    if (!outPath) return;
    const css = exportCss;
    await api.exportPDF(activeTab.html, css, outPath);
  }, [activeTab, api]);

  const exportDocx = useCallback(async () => {
    if (!activeTab || !api.showSaveDialog || !api.exportDOCX) return;

    const outPath = await api.showSaveDialog({
      defaultExt: 'docx',
    });
    if (!outPath) return;
    const css = exportCss;
    await api.exportDOCX(activeTab.html, css, outPath);
  }, [activeTab, api]);

  return { exportHtml, exportPdf, exportDocx };
}
