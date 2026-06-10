interface ChromeRuntime {
  getURL(path: string): string;
}

interface ChromeTabs {
  create(options: { url: string }): void;
}

interface ChromeStorageArea {
  get(defaults: Record<string, unknown>): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
}

interface ChromeApi {
  runtime?: ChromeRuntime;
  tabs?: ChromeTabs;
  storage?: {
    local?: ChromeStorageArea;
  };
}

declare const chrome: ChromeApi | undefined;
