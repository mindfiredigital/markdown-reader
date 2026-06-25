import type { MarkdownReaderAPI } from '@package/shared-types';
import type { ChromeExtensionApi, ChromeRuntimeEvent } from '../../types/chrome-type';

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

export function isRuntimeEvent(message: unknown, type: string): message is ChromeRuntimeEvent {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    (message as { type?: unknown }).type === type
  );
}

export function buildFullHtml(html: string, css: string): string {
  return `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<style>\n${css}\n</style>\n</head>\n<body>\n${html}\n</body>\n</html>`;
}
