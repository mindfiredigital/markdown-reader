import { handleExtensionMessage, isExtensionMessage } from './utils/helpers/message-handler';
import type { ChromeExtensionApi, SendResponse } from './types';

// Collects the global chrome api ,so extension background worker doesn't crash
const chromeApi = (globalThis as typeof globalThis & { chrome?: ChromeExtensionApi }).chrome;
const runtime = chromeApi?.runtime;

if (!runtime?.onMessage) {
  throw new Error('Chrome runtime messaging is unavailable.');
}

// extension opens the full reader tab
chromeApi?.action?.onClicked.addListener(() => {
  const viewerUrl = runtime.getURL('viewer.html');
  if (chromeApi?.tabs) {
    Promise.resolve(chromeApi.tabs.create({ url: viewerUrl })).catch((error) => {
      console.error('Failed to create tab:', error);
    });
  }
});

// listens for any messages coming from our React ui, checks if they are valid and passes them to handler.
runtime.onMessage.addListener((message: unknown, _sender: unknown, sendResponse: SendResponse) => {
  if (!isExtensionMessage(message)) {
    sendResponse({ ok: false, error: 'Invalid extension message.' });
    return false;
  }

  void handleExtensionMessage(message)
    .then(sendResponse)
    .catch((error: unknown) => {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    });

  return true;
});
