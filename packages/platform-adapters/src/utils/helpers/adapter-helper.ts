import type { MarkdownReaderAPI } from '@package/shared-types';
import type { ChromeExtensionApi } from '../../types/chrome-type';

export function getElectronApi(): MarkdownReaderAPI | null {
  const candidate = globalThis as typeof globalThis & {
    window?: { api?: MarkdownReaderAPI };
  };

  return candidate.window?.api ?? null;
}

export function getChromeApi(): ChromeExtensionApi | null {
  const candidate = globalThis as typeof globalThis & {
    chrome?: ChromeExtensionApi;
  };

  return candidate.chrome ?? null;
}

export function isElectronRuntime(): boolean {
  return Boolean(getElectronApi());
}

export function isChromeExtensionRuntime(): boolean {
  return Boolean(getChromeApi()?.runtime?.sendMessage && getChromeApi()?.storage?.local);
}

export function createUnsupportedPlatformMethod(methodName: string): never {
  throw new Error(`${methodName} is not supported by this platform adapter.`);
}

export function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
