import { TOCType } from '@package/shared-types';
export type EmptyStateProps = {
  onChooseFile: () => void;
};
export type MarkdownViewProps = {
  html: string;
};
export type TocPanelProps = {
  items: TOCType[];
  scrollRoot: HTMLElement | null;
};
export type OpenedMarkdownDocument = {
  id: string;
  name: string;
  markdown: string;
};

export type RenderedMarkdownDocument = {
  html: string;
  toc: TOCType[];
};

export type ToolbarProps = {
  fileName?: string | undefined;
  query: string;
  matchCount: number;
  currentMatch: number;
  onOpenFile: () => void;
  onQueryChange: (query: string) => void;
  onPreviousMatch: () => void;
  onNextMatch: () => void;
  onToggleTheme: () => void;
  onFontSizeChange: (updater: (fontSize: number) => number) => void;
};

export type ExtensionTheme = 'github-light' | 'github-dark';

export type ExtensionSettings = {
  theme: ExtensionTheme;
  fontSize: number;
};
