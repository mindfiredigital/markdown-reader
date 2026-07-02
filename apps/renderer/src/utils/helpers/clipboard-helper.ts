import { logger } from './logger';

export const copyToClipboard = async (content: string, mimeType: string): Promise<boolean> => {
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
    logger.error('Failed to copy text: ', err);
    return false;
  }
};
