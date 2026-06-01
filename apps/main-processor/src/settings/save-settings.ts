import { AppSettings } from '@package/shared-types';
import {
  validateSettings,
  getSettingsPath,
  writeSettingsAtomically,
} from '../utils/helper/setting-helper';
import { getSettings } from './get-settings';
import { runExclusive } from '../utils/helper/setting-helper';

/*Save settings changes to local file*/
export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  return runExclusive(async () => {
    const validatedSettings = validateSettings(settings);
    const nextSettings: AppSettings = { ...(await getSettings()), ...validatedSettings };
    const settingsPath = getSettingsPath();
    try {
      await writeSettingsAtomically(settingsPath, nextSettings);
      return nextSettings;
    } catch (error) {
      throw new Error('Failed to save settings file', { cause: error });
    }
  });
}
