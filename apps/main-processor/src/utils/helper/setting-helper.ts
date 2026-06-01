import { app } from 'electron';
import path from 'path';
import { mkdir, open, rename, unlink, writeFile } from 'node:fs/promises';
import { AppSettings } from '@package/shared-types';
import { THEMES } from '@package/shared-constants';
import { SETTINGS_KEYS, READING_WIDTHS } from '../constants/setting-constants';

/* Gives file system path for settings.json */
export function getSettingsPath(): string {
  return path.join(app.getPath('userData'), 'settings.json');
}

/* To validate the settings preference before saving */
export function validateSettings(partial: Partial<AppSettings>): Partial<AppSettings> {
  if (!partial || typeof partial !== 'object' || Array.isArray(partial)) {
    throw new Error('Invalid settings object');
  }

  const validated: Partial<AppSettings> = {};
  for (const [key, value] of Object.entries(partial)) {
    if (!SETTINGS_KEYS.has(key as keyof AppSettings)) {
      throw new Error(`Unknown settings key: ${key}`);
    }

    if (key === 'theme') {
      if (typeof value !== 'string' || !THEMES.includes(value as AppSettings['theme'])) {
        throw new Error('Invalid theme');
      }
      validated.theme = value as AppSettings['theme'];
    }
    if (key === 'fontSize') {
      if (typeof value !== 'number' || value < 12 || value > 24)
        throw new Error('Invalid fontSize');
      validated.fontSize = value;
    }
    if (key === 'readingWidth') {
      if (!READING_WIDTHS.has(value as AppSettings['readingWidth'])) {
        throw new Error('Invalid readingWidth');
      }
      validated.readingWidth = value as AppSettings['readingWidth'];
    }
    if (key === 'lineNumbers') {
      if (typeof value !== 'boolean') throw new Error('Invalid lineNumbers');
      validated.lineNumbers = value;
    }
    if (key === 'customCss') {
      if (typeof value !== 'string') throw new Error('Invalid customCss');
      validated.customCss = value;
    }
    if (key === 'zoom') {
      if (typeof value !== 'number' || value < 50 || value > 200) throw new Error('Invalid zoom');
      validated.zoom = value;
    }
    if (key === 'recentFilesLimit') {
      if (typeof value !== 'number' || value < 1 || value > 50) {
        throw new Error('Invalid recentFilesLimit');
      }
      validated.recentFilesLimit = value;
    }
    if (key === 'showHiddenFiles') {
      if (typeof value !== 'boolean') throw new Error('Invalid showHiddenFiles');
      validated.showHiddenFiles = value;
    }
  }

  return validated;
}

/* writes settings to disk without risking file corruption*/
export async function writeSettingsAtomically(
  settingsPath: string,
  nextSettings: AppSettings
): Promise<void> {
  const dir = path.dirname(settingsPath);
  const tempPath = `${settingsPath}.tmp`;

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(tempPath, JSON.stringify(nextSettings, null, 2), 'utf-8');

    const tempFile = await open(tempPath, 'r');
    try {
      await tempFile.sync();
    } finally {
      await tempFile.close();
    }
    await rename(tempPath, settingsPath);
  } catch (error) {
    await unlink(tempPath).catch(() => {});
    throw error;
  }
}

/* Runs an asynchronous operation sequentially to prevent concurrent execution*/
let mutex: Promise<void> = Promise.resolve();

export async function runExclusive<T>(operation: () => Promise<T>): Promise<T> {
  const previous = mutex;
  let release!: () => void;
  mutex = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previous.catch(() => {});

  try {
    return await operation();
  } finally {
    release();
  }
}
