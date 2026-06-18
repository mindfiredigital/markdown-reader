import { CHROME_MESSAGE_TYPES } from '@package/platform-adapters';
import type { ExtensionMessage, ExtensionMessageResponse } from '../../types';

// List of all desktop stuff that browser extensions simply aren't allowed to touch
const unsupportedDesktopOperations = new Set<string>([
  CHROME_MESSAGE_TYPES.READ_FILE,
  CHROME_MESSAGE_TYPES.OPEN_FILE_DIALOG,
  CHROME_MESSAGE_TYPES.OPEN_FOLDER_DIALOG,
  CHROME_MESSAGE_TYPES.READ_FOLDER,
  CHROME_MESSAGE_TYPES.SEARCH_FOLDER,
  CHROME_MESSAGE_TYPES.WATCH_FILE,
  CHROME_MESSAGE_TYPES.UNWATCH_FILE,
  CHROME_MESSAGE_TYPES.SHOW_SAVE_DIALOG,
  CHROME_MESSAGE_TYPES.EXPORT_HTML,
  CHROME_MESSAGE_TYPES.EXPORT_PDF,
  CHROME_MESSAGE_TYPES.EXPORT_DOCX,
  CHROME_MESSAGE_TYPES.DOWNLOAD_UPDATE,
]);

// It catches incoming messages from the UI and blocks them if they ask for desktop only features
export async function handleExtensionMessage(
  message: ExtensionMessage
): Promise<ExtensionMessageResponse> {
  if (unsupportedDesktopOperations.has(message.type)) {
    return {
      ok: false,
      error: `${message.type} is not available in the Chrome extension background worker yet.`,
    };
  }

  return {
    ok: false,
    error: `Unsupported extension message type: ${message.type}`,
  };
}

// checks if the message object has a valid type string before read
export function isExtensionMessage(message: unknown): message is ExtensionMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    typeof (message as { type?: unknown }).type === 'string'
  );
}
