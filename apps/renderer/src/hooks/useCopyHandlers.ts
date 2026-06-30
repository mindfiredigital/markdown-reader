import { useCallback } from 'react';

export function useCopyHandlers() {
  const copyToClipboard = async (content: string, mimeType: string): Promise<boolean> => {
    try {
      if (!navigator?.clipboard) {
        throw new Error('Clipboard API not available');
      }

      if (window.ClipboardItem) {
        const type = mimeType;
        const blob = new Blob([content], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        await navigator.clipboard.write(data);
        return true;
      } else if (navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
        return true;
      } else {
        throw new Error('Clipboard API write methods not available');
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      return false;
    }
  };

  const copyAsMarkdown = useCallback(async (markdown: string | undefined): Promise<boolean> => {
    if (!markdown) return false;
    return await copyToClipboard(markdown, 'text/plain');
  }, []);

  const copyAsPlainText = useCallback(async (html: string | undefined): Promise<boolean> => {
    if (!html) return false;
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    const plainText = tempElement.innerText || tempElement.textContent || '';
    return await copyToClipboard(plainText, 'text/plain');
  }, []);

  return {
    copyAsMarkdown,
    copyAsPlainText,
  };
}
