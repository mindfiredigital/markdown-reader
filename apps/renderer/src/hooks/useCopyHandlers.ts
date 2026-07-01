import { useCallback } from 'react';
import { copyToClipboard } from '../utils/helpers/clipboard-helper';

export function useCopyHandlers() {
  const copyAsMarkdown = useCallback(async (markdown: string | undefined): Promise<boolean> => {
    if (!markdown) return false;
    return await copyToClipboard(markdown, 'text/plain');
  }, []);

  const copyAsPlainText = useCallback(async (html: string | undefined): Promise<boolean> => {
    if (!html) return false;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const plainText = doc.body.textContent || '';
    return await copyToClipboard(plainText, 'text/plain');
  }, []);

  return {
    copyAsMarkdown,
    copyAsPlainText,
  };
}
