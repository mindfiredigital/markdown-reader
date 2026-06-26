import { useCallback } from 'react';

export function useCopyHandlers() {
  const copyToClipboard = async (content: string, mimeType: string) => {
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const type = mimeType;
        const blob = new Blob([content], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        await navigator.clipboard.write(data);
      } else {
        if (mimeType === 'text/plain') {
          await navigator.clipboard.writeText(content);
        } else {
          await navigator.clipboard.writeText(content);
        }
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyAsMarkdown = useCallback(async (markdown: string | undefined) => {
    if (!markdown) return;
    await copyToClipboard(markdown, 'text/plain');
  }, []);

  const copyAsPlainText = useCallback(async (html: string | undefined) => {
    if (!html) return;
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    const plainText = tempElement.innerText || tempElement.textContent || '';
    await copyToClipboard(plainText, 'text/plain');
  }, []);

  return {
    copyAsMarkdown,
    copyAsPlainText,
  };
}
