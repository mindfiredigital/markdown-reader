import { readFile } from 'node:fs/promises';
import { DEFAULT_SETTINGS } from '@package/shared-types';
import { AppSettings } from '@package/shared-types';
import { validateSettings, getSettingsPath } from '../utils/helper/setting-helper';

/*Loads settings from local file system */
export async function getSettings(): Promise<AppSettings> {
  const settingsPath = getSettingsPath();
  try {
    const data = await readFile(settingsPath, 'utf-8');
    const parsed = JSON.parse(data);
    if (parsed && typeof parsed === 'object') {
      return { ...DEFAULT_SETTINGS, ...validateSettings(parsed) };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
