import { useCallback } from 'react';
import { logger } from '../utils/helpers/logger';
import { ActiveTab } from '../types/component-types';
import exportCss from '../styles/export.css?raw';
import { usePlatformAPI } from '../hooks/usePlatform';

export function useExport(activeTab: ActiveTab) {
  const api = usePlatformAPI();

  const exportHtml = useCallback(async () => {
    if (!activeTab || !api.exportHTML) return;
    const css = exportCss;

    try {
      if (api.showSaveDialog) {
        const outPath = await api.showSaveDialog({ defaultExt: 'html' });
        if (!outPath) return;
        await api.exportHTML(activeTab.html, css, outPath);
      } else {
        await api.exportHTML(activeTab.html, css, '');
      }
    } catch (err) {
      logger.error('Failed to export HTML:', err instanceof Error ? err.message : String(err));
    }
  }, [activeTab, api]);

  const exportPdf = useCallback(async () => {
    if (!activeTab || !api.exportPDF) return;
    const css = exportCss;

    try {
      if (api.showSaveDialog) {
        const outPath = await api.showSaveDialog({ defaultExt: 'pdf' });
        if (!outPath) return;
        await api.exportPDF(activeTab.html, css, outPath);
      } else {
        await api.exportPDF(activeTab.html, css, '');
      }
    } catch (err) {
      logger.error('Failed to export PDF:', err instanceof Error ? err.message : String(err));
    }
  }, [activeTab, api]);

  const exportDocx = useCallback(async () => {
    if (!activeTab || !api.exportDOCX) return;
    const css = exportCss;

    try {
      if (api.showSaveDialog) {
        const outPath = await api.showSaveDialog({ defaultExt: 'docx' });
        if (!outPath) return;
        await api.exportDOCX(activeTab.html, css, outPath);
      } else {
        await api.exportDOCX(activeTab.html, css, '');
      }
    } catch (err) {
      logger.error('Failed to export DOCX:', err instanceof Error ? err.message : String(err));
    }
  }, [activeTab, api]);

  return {
    exportHtml: api.exportHTML ? exportHtml : undefined,
    exportPdf: api.exportPDF ? exportPdf : undefined,
    exportDocx: api.exportDOCX ? exportDocx : undefined,
  };
}
