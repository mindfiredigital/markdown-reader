import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createUnsupportedPlatformMethod,
  getChromeApi,
  getElectronApi,
  isChromeExtensionRuntime,
  isElectronRuntime,
  toErrorMessage,
} from '../src/utils/helpers/adapter-helper';

describe('runtime helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should find the electron preload api', () => {
    const api = { readFile: vi.fn() };
    vi.stubGlobal('window', { api });

    expect(getElectronApi()).toBe(api);
    expect(isElectronRuntime()).toBe(true);
  });

  it('should find a usable chrome extension api', () => {
    const chrome = {
      runtime: { sendMessage: vi.fn() },
      storage: { local: {} },
    };
    vi.stubGlobal('chrome', chrome);

    expect(getChromeApi()).toBe(chrome);
    expect(isChromeExtensionRuntime()).toBe(true);
  });

  it('should reject an incomplete chrome api', () => {
    vi.stubGlobal('chrome', { runtime: { sendMessage: vi.fn() } });

    expect(isChromeExtensionRuntime()).toBe(false);
  });

  it('should keep unsupported method errors readable', () => {
    expect(() => createUnsupportedPlatformMethod('chrome.storage.local.get')).toThrow(
      'chrome.storage.local.get is not supported by this platform adapter.'
    );
  });

  it('should normalize error messages', () => {
    expect(toErrorMessage(new Error('failed'))).toBe('failed');
    expect(toErrorMessage('plain failure')).toBe('plain failure');
  });
});
