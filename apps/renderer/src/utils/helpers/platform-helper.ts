import {
  ChromeAdapter,
  ElectronAdapter,
  isChromeExtensionRuntime,
  isElectronRuntime,
  type PlatformAdapter,
} from '@package/platform-adapters';

// Detects the current execution environment and instantiates the  adapter.
export function createPlatformAdapter(): PlatformAdapter {
  if (isElectronRuntime()) {
    return new ElectronAdapter();
  }

  if (isChromeExtensionRuntime()) {
    return new ChromeAdapter();
  }

  throw new Error('No supported platform adapter was detected.');
}
