import { ExtensionSettings } from '../types';
import { SETTINGS_KEY, defaultExtensionSettings } from '../utils/constants/storage-constants';

export async function getExtensionSettings(): Promise<ExtensionSettings> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? { ...defaultExtensionSettings, ...JSON.parse(saved) } : defaultExtensionSettings;
  }

  const result = await chrome.storage.local.get({ [SETTINGS_KEY]: defaultExtensionSettings });
  return {
    ...defaultExtensionSettings,
    ...(result[SETTINGS_KEY] as Partial<ExtensionSettings>),
  };
}

export async function saveExtensionSettings(settings: ExtensionSettings): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return;
  }

  await chrome.storage.local.set({ [SETTINGS_KEY]: settings });
}
