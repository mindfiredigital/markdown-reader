import type { PlatformMessage } from '@package/platform-adapters';

export type ExtensionMessage = PlatformMessage<Record<string, unknown>>;

export type ExtensionMessageResponse<TData = unknown> =
  | {
      ok: true;
      data: TData;
    }
  | {
      ok: false;
      error: string;
    };

export type SendResponse = (response: ExtensionMessageResponse) => void;

export type ChromeRuntime = {
  getURL(path: string): string;
  onMessage: {
    addListener(
      listener: (message: unknown, sender: unknown, sendResponse: SendResponse) => boolean | void
    ): void;
  };
};

export type ChromeAction = {
  onClicked: {
    addListener(listener: () => void): void;
  };
};

export type ChromeTabs = {
  create(properties: { url: string }): Promise<unknown> | void;
};

export type ChromeExtensionApi = {
  runtime?: ChromeRuntime;
  action?: ChromeAction;
  tabs?: ChromeTabs;
};
