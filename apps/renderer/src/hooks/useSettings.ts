import { useCallback, useEffect, useState } from 'react';
import { FONT_SIZE, WIDTH_MAP } from '../types/component-types';
import { AppSettings, DEFAULT_SETTINGS, ReadingWidth } from '@package/shared-types';

export function useSettings() {
  const [fontSize, setFontSize] = useState(FONT_SIZE.DEFAULT);
  const [readingWidth, setReadingWidth] = useState<ReadingWidth>('default');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!window.api) return;

    void window.api
      .getSettings()
      .then((savedSettings) => {
        setSettings(savedSettings);
        setFontSize(savedSettings.fontSize);
        setReadingWidth(savedSettings.readingWidth);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size-content', `${fontSize}px`);
    setSettings((current) => ({ ...current, fontSize }));
  }, [fontSize]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--reading-width',
      WIDTH_MAP[readingWidth] ?? '768px'
    );
    setSettings((current) => ({ ...current, readingWidth }));
  }, [readingWidth]);

  useEffect(() => {
    const styleId = 'markdown-reader-custon-css';
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = settings.customCss;
  }, [settings.customCss]);

  const increaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.min(FONT_SIZE.MAX, prev + FONT_SIZE.INCREMENT));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontSize((prev) => Math.max(FONT_SIZE.MIN, prev - FONT_SIZE.INCREMENT));
  }, []);

  const resetFontSize = useCallback(() => {
    setFontSize(FONT_SIZE.DEFAULT);
  }, []);

  const updateSettings = useCallback(
    async (partial: Partial<AppSettings>) => {
      if (!window.api) {
        const next = { ...settings, ...partial };
        setSettings(next);
        setFontSize(next.fontSize);
        setReadingWidth(next.readingWidth);
        return;
      }

      const next = await window.api.saveSettings(partial);
      setSettings(next);
      setFontSize(next.fontSize);
      setReadingWidth(next.readingWidth);
    },
    [settings]
  );
  return {
    settings,
    fontSize,
    readingWidth,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    setReadingWidth,
    updateSettings,
  };
}
