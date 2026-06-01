import { useCallback, useEffect, useState } from 'react';
import { FONT_SIZE, WIDTH_MAP } from '../types/component-types';
import { AppSettings, DEFAULT_SETTINGS } from '@package/shared-types';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const fontSize = settings.fontSize;
  const readingWidth = settings.readingWidth;

  useEffect(() => {
    if (!window.api) return;

    void window.api
      .getSettings()
      .then((savedSettings) => {
        setSettings(savedSettings);
      })
      .catch(() => {});
  }, []);

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

  const increaseFontSize = useCallback(() => {
    setSettings((current) => ({
      ...current,
      fontSize: Math.min(FONT_SIZE.MAX, current.fontSize + FONT_SIZE.INCREMENT),
    }));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setSettings((current) => ({
      ...current,
      fontSize: Math.max(FONT_SIZE.MIN, current.fontSize - FONT_SIZE.INCREMENT),
    }));
  }, []);

  const resetFontSize = useCallback(() => {
    setSettings((current) => ({ ...current, fontSize: FONT_SIZE.DEFAULT }));
  }, []);

  const updateSettings = useCallback(async (partial: Partial<AppSettings>) => {
    if (!window.api) {
      setSettings((current) => ({ ...current, ...partial }));
      return;
    }

    try {
      const next = await window.api.saveSettings(partial);
      setSettings(next);
    } catch {
      setSettings((current) => ({ ...current, ...partial }));
    }
  }, []);
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
