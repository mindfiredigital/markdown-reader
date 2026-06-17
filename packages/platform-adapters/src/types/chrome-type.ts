export type ChromeStorageArea = {
  get(keys?: string | string[] | Record<string, unknown> | null): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
  clear(): Promise<void>;
};

export type ChromeRuntime = {
  lastError?: { message?: string };
  sendMessage<TResponse = unknown>(message: unknown): Promise<TResponse>;
  onMessage?: {
    addListener(
      listener: (
        message: unknown,
        sender: unknown,
        sendResponse: (response?: unknown) => void
      ) => boolean | void
    ): void;
    removeListener(
      listener: (
        message: unknown,
        sender: unknown,
        sendResponse: (response?: unknown) => void
      ) => void
    ): void;
  };
};

export type ChromeExtensionApi = {
  storage?: {
    local?: ChromeStorageArea;
  };
  runtime?: ChromeRuntime;
};

export type ChromeMessageResponse<TResponse> =
  | {
      ok: true;
      data: TResponse;
    }
  | {
      ok: false;
      error: string;
    };

export interface ChromeRuntimeEvent<TPayload = unknown> {
  type: string;
  payload?: TPayload;
}
