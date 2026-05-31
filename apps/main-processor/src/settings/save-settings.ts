import path from 'path';
import { writeFile, mkdir } from 'node:fs/promises';
import { AppSettings } from '@package/shared-types';
import { validateSettings, getSettingsPath } from '../utils/helper/setting-helper';
import { getSettings } from './get-settings';

/*Save settings changes to local file*/
export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  const validatedSettings = validateSettings(settings);
  const nextSettings: AppSettings = { ...(await getSettings()), ...validatedSettings };
  const settingsPath = getSettingsPath();
  try {
    const dir = path.dirname(settingsPath);
    await mkdir(dir, { recursive: true });
    await writeFile(settingsPath, JSON.stringify(nextSettings, null, 2), 'utf-8');
    return nextSettings;
  } catch (error) {
    throw new Error('Failed to save settings file', { cause: error });
  }
}
