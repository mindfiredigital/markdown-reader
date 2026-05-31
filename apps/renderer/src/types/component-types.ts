import React from 'react';
import { APPTHEMES } from '../utils/constants/theme-constants';
import { RecentFile } from '@package/shared-types/dist/src/recentfile-type';
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

export type BuiltThemeType =
  | 'github-light'
  | 'github-dark'
  | 'notion'
  | 'nord'
  | 'minimal'
  | 'dracula';
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
  query: string;
  matchCount: number;
  currentMatch: number;
  onQueryChange: (q: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
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
}

export interface Tab {
  id: string;
  filePath: string;
  fileName: string;
  html: string;
  toc?: TOCType[];
  scrollTop: number;
  fontSize: number;
}

export interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
}

export type TabAction =
  | { type: 'OPEN_TAB'; payload: { filePath: string; html?: string; toc?: TOCType[] } }
  | { type: 'CLOSE_TAB'; payload: { tabId: string } }
  | { type: 'SWITCH_TAB'; payload: { tabId: string } }
  | {
      type: 'UPDATE_TAB_STATE';
      payload: {
        tabId: string;
        html?: string;
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
}

export interface SettingsPanelProps {
  settings: AppSettings;
  isOpen: boolean;
  onClose: () => void;
  onChange: (settings: Partial<AppSettings>) => void;
  appVersion?: string;
}
