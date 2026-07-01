import React from 'react';
import { APPTHEMES } from '../utils/constants/theme-constants';
import { RecentFile } from '@package/shared-types';
import { AppSettings, FileType } from '@package/shared-types';
import { ReadingWidth } from '@package/shared-types';
import {
  DEFAULT_FONT_SIZE,
  DEFAULT_WIDTH,
  FONT_SIZE_INCREMENT,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  NARROW_WIDTH,
  WIDE_WIDTH,
} from '@package/shared-constants';
import { FolderSearchResult } from '@package/shared-types';
export interface ErrorProps {
  message: string;
  onRetry: () => void;
}

export interface ReaderProps {
  html: string;
  getHiglightedHtml: (html: string) => string;
}

export interface WelcomeProps {
  onOpen: () => void;
  recentFiles: RecentFile[];
  onOpenRecent?: (path: string) => void;
}

export type Theme = (typeof APPTHEMES)[number];
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export interface HeadingProps {
  text: string;
  depth: number;
}
export interface TOCType {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}

export interface SidebarProps {
  tocItems: TOCType[];
  activeId: string;
  onSelect: (id: string) => void;
  isVisible?: boolean;
}

export interface ToastProps {
  message: string;
  show: boolean;
  onDone: () => void;
  duration?: number;
}

export interface SearchBarProps {
  query?: string;
  folderQuery?: string;
  matchCount: number;
  currentMatch: number;
  onQueryChange: (q: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  mode?: 'document' | 'folder';
  folderResults?: FolderSearchResult[];
  isSearchingFolder?: boolean;
  onOpenFolderResult?: (result: FolderSearchResult) => void;
  hasFolder?: boolean;
  caseSensitive?: boolean;
  onToggleCaseSensitive?: () => void;
}

export const FONT_SIZE = {
  DEFAULT: DEFAULT_FONT_SIZE,
  MIN: MIN_FONT_SIZE,
  MAX: MAX_FONT_SIZE,
  INCREMENT: FONT_SIZE_INCREMENT,
};

export const WIDTH_MAP: Record<ReadingWidth, string> = {
  narrow: `${NARROW_WIDTH}px`,
  default: `${DEFAULT_WIDTH}px`,
  wide: `${WIDE_WIDTH}px`,
};
export interface StatusBarProps {
  filePath: string;
  theme: string;
  fontSize: number;
}

export interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSwitch: (id: string) => void;
  onClose: (id: string) => void;
  plusOpen: () => void;
}

export interface Tab {
  id: string;
  filePath: string;
  fileName: string;
  html: string;
  markdown?: string;
  toc?: TOCType[];
  scrollTop: number;
  fontSize: number;
}

export interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
}

export type TabAction =
  | {
      type: 'OPEN_TAB';
      payload: { filePath: string; html?: string; markdown?: string; toc?: TOCType[] };
    }
  | { type: 'CLOSE_TAB'; payload: { tabId: string } }
  | { type: 'SWITCH_TAB'; payload: { tabId: string } }
  | {
      type: 'UPDATE_TAB_STATE';
      payload: {
        tabId: string;
        html?: string;
        markdown?: string;
        toc?: TOCType[];
        scrollTop?: number;
        fontSize?: number;
      };
    };

export interface FileBrowserProps {
  tree: FileType | null;
  activeFilePath: string;
  onOpenFile: (path: string) => void;
  isVisible?: boolean;
}

export interface FileTreeProps {
  node: FileType;
  depth: number;
  activeFilePath: string;
  onOpenFile: (path: string) => void;
}

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ElectronFile extends File {
  path: string;
}

export type ActiveTab = {
  html: string;
} | null;

export interface ReaderToolbarProps {
  fontSize: number;
  theme: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onToggleTheme: () => void;
  isExtension?: boolean;
  onOpenFile?: () => void;
  onOpenSettings?: () => void;
  onOpenSearch?: () => void;
  updateVersion?: string | null;
  onDownloadUpdate?: () => void;
  onExportHtml?: (() => void) | undefined;
  onExportPdf?: (() => void) | undefined;
  onExportDocx?: (() => void) | undefined;
  onCopyMd?: () => Promise<void> | void;
  onCopyText?: () => Promise<void> | void;
  viewMode?: ViewMode;
  onToggleRawText?: () => void;
}

export type ViewMode = 'rendered' | 'raw';

export interface RawTextViewerProps {
  markdown?: string | undefined;
}

export interface SettingsPanelProps {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onChange: (settings: Partial<AppSettings>) => void;
  appVersion?: string;
}

export type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export interface ReaderStatsProps {
  markdown: string | undefined;
}
