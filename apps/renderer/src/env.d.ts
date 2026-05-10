import { MarkdownReaderAPI, ThemeType } from '@package/shared-types';

declare global {
  interface Window {
    api: MarkdownReaderAPI;
    theme: ThemeType;
  }
}

export {};
