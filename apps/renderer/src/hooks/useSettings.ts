import { useCallback, useEffect, useState } from 'react';
import { FONT_SIZE, WIDTH_MAP } from '../types/component-types';
import { AppSettings, DEFAULT_SETTINGS } from '@package/shared-types';
import { usePlatformAPI } from '../hooks/usePlatform';

export function useSettings() {
  const api = usePlatformAPI();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const fontSize = settings.fontSize;
  const readingWidth = settings.readingWidth;

  useEffect(() => {
    if (!api.getSettings) return;

    void api
      .getSettings()
      .then((savedSettings) => {
        setSettings(savedSettings);
      })
      .catch((error) => {
        console.error('Failed to load settings using defaults', error);
      });
  }, [api]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size-content', `${fontSize}px`);
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--reading-width',
      WIDTH_MAP[readingWidth] ?? '768px'
    );
  }, [readingWidth]);

  useEffect(() => {
    const styleId = 'markdown-reader-custom-css';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = settings.customCss || '';
  }, [settings.customCss]);

  const updateSettings = useCallback(
    async (partial: Partial<AppSettings>) => {
      if (!api.saveSettings) {
        setSettings((current) => ({ ...current, ...partial }));
        return;
      }

      try {
        const next = await api.saveSettings(partial);
        setSettings(next);
      } catch (error) {
        console.error('Failed to save settings:', error);
        throw error;
      }
    },
    [api]
  );

  const increaseFontSize = useCallback(() => {
    return updateSettings({
      fontSize: Math.min(FONT_SIZE.MAX, settings.fontSize + FONT_SIZE.INCREMENT),
    });
  }, [settings.fontSize, updateSettings]);

  const decreaseFontSize = useCallback(() => {
    return updateSettings({
      fontSize: Math.max(FONT_SIZE.MIN, settings.fontSize - FONT_SIZE.INCREMENT),
    });
  }, [settings.fontSize, updateSettings]);

  const resetFontSize = useCallback(() => {
    return updateSettings({ fontSize: FONT_SIZE.DEFAULT });
  }, [updateSettings]);

  return {
    settings,
    fontSize,
    readingWidth,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    updateSettings,
  };
}
