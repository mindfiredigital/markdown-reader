import { useEffect } from 'react';
import { MENU_EVENTS } from '@package/shared-constants';
import { UseMenuEventsProps } from '../types/hook-types';
import { Theme } from '../types/component-types';
import { usePlatformAPI } from '../hooks/usePlatform';
export function useMenuEvents({
  onOpenFile,
  onOpenFolder,
  onSearchDocument,
  onSearchFolder,
  onToggleToc,
  onToggleBrowser,
  onFocusMode,
  onCycleTheme,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onNextTab,
  onPreviousTab,
  onCloseTab,
  onExportHtml,
  onExportPdf,
  onExportDocx,
  onOpenSettings,
  onSetTheme,
}: UseMenuEventsProps) {
  const api = usePlatformAPI();
  useEffect(() => {
    if (!api.onMenuEvent) return;

    api.onMenuEvent(MENU_EVENTS.OPEN_FILE, onOpenFile);
    api.onMenuEvent(MENU_EVENTS.OPEN_FOLDER, onOpenFolder);
    api.onMenuEvent(MENU_EVENTS.SEARCH_DOCUMENT, onSearchDocument);
    api.onMenuEvent(MENU_EVENTS.SEARCH_FOLDER, onSearchFolder);
    api.onMenuEvent(MENU_EVENTS.TOGGLE_TOC, onToggleToc);
    api.onMenuEvent(MENU_EVENTS.TOGGLE_BROWSER, onToggleBrowser);
    api.onMenuEvent(MENU_EVENTS.FOCUS_MODE, onFocusMode);
    api.onMenuEvent(MENU_EVENTS.CYCLE_THEME, onCycleTheme);
    api.onMenuEvent(MENU_EVENTS.ZOOM_IN, onZoomIn);
    api.onMenuEvent(MENU_EVENTS.ZOOM_OUT, onZoomOut);
    api.onMenuEvent(MENU_EVENTS.ZOOM_RESET, onZoomReset);
    api.onMenuEvent(MENU_EVENTS.NEXT_TAB, onNextTab);
    api.onMenuEvent(MENU_EVENTS.PREVIOUS_TAB, onPreviousTab);
    api.onMenuEvent(MENU_EVENTS.CLOSE_TAB, onCloseTab);
    api.onMenuEvent(MENU_EVENTS.EXPORT_HTML, onExportHtml);
    api.onMenuEvent(MENU_EVENTS.EXPORT_PDF, onExportPdf);
    api.onMenuEvent(MENU_EVENTS.EXPORT_DOCX, onExportDocx);
    api.onMenuEvent(MENU_EVENTS.OPEN_SETTINGS, onOpenSettings);
    api.onMenuEvent(MENU_EVENTS.SET_THEME, (theme) => {
      if (typeof theme === 'string') {
        onSetTheme(theme as Theme);
      }
    });

    return () => {
      api.removeMenuListeners?.();
    };
  }, [
    api,
    onOpenFile,
    onOpenFolder,
    onSearchDocument,
    onSearchFolder,
    onToggleToc,
    onToggleBrowser,
    onFocusMode,
    onCycleTheme,
    onZoomIn,
    onZoomOut,
    onZoomReset,
    onNextTab,
    onPreviousTab,
    onCloseTab,
    onExportHtml,
    onExportPdf,
    onExportDocx,
    onOpenSettings,
    onSetTheme,
  ]);
}
