import React from 'react';
import { TOCType } from './component-types';
import { Tab, TabAction } from './component-types';

type LoadFileResult =
  | {
      filePath: string;
      html: string;
      toc?: TOCType[];
    }
  | null
  | undefined;

export interface FilePersistenceProps {
  activeTab: Tab | null;
  loadFile: (path: string) => Promise<LoadFileResult>;
  dispatch: React.Dispatch<TabAction>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FileActionProps {
  loadFile: (path: string) => Promise<LoadFileResult>;
  dispatch: React.Dispatch<TabAction>;
}

export interface UseMenuEventsProps {
  onOpenFile: () => void;
  onOpenFolder: () => void;
  onSearchDocument: () => void;
  onSearchFolder: () => void;
  onToggleToc: () => void;
  onToggleBrowser: () => void;
  onFocusMode: () => void;
  onCycleTheme: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onNextTab: () => void;
  onPreviousTab: () => void;
  onCloseTab: () => void;
  onExportHtml: () => void;
  onExportPdf: () => void;
  onExportDocx: () => void;
}

export interface UseShortcutsProps {
  onOpenFile: () => void;
  onOpenFolder: () => void;
  onToggleFocusMode: () => void;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onOpenFolderSearch: () => void;
  onCloseSearch: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onToggleSidebar: () => void;
  onToggleFileBrowser: () => void;
}

export interface UseSearchProps {
  query: string;
  currentMatch: number;
  matchCount: number;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  setQuery: (q: string) => void;
  goToNextMatch: () => void;
  goToPrevMatch: () => void;
  getHiglightedHtml: (html: string) => string;
}
