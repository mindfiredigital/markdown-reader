export { ChromeAdapter } from './adapters/chrome-adapter';
export { ElectronAdapter } from './adapters/electron-adapter';
export {
  PLATFORM_KIND,
  STORAGE_KEYS,
  CHROME_MESSAGE_TYPES,
} from './utils/constants/adapter-constants';
export {
  isChromeExtensionRuntime,
  getChromeApi,
  getElectronApi,
  isElectronRuntime,
  createUnsupportedPlatformMethod,
  toErrorMessage,
} from './utils/helpers/adapter-helper';
export type { StorageAdapter } from './types/storage-type';
export type { PlatformKind, PlatformAdapter, PlatformMessage } from './types/platform-type';
