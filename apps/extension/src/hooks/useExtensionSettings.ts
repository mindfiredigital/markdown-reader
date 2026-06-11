import { useEffect, useState } from 'react';
import { getExtensionSettings, saveExtensionSettings } from '../platform/storage';
import { ExtensionTheme } from '../types';
import { isExtensionTheme, clampFontSize } from '../utils/helpers/extension helper';
import { defaultExtensionSettings } from '../utils/constants/storage-constants';
import { themes } from '../utils/constants/theme-constants';

export function useExtensionSettings() {
  const [theme, setTheme] = useState<ExtensionTheme>(defaultExtensionSettings.theme);
  const [fontSize, setFontSize] = useState(defaultExtensionSettings.fontSize);

  useEffect(() => {
    void getExtensionSettings().then((settings) => {
      setTheme(isExtensionTheme(settings.theme) ? settings.theme : defaultExtensionSettings.theme);
      setFontSize(clampFontSize(settings.fontSize));
    });
  }, []);

  useEffect(() => {
    void saveExtensionSettings({ theme, fontSize });
  }, [theme, fontSize]);

  function toggleTheme() {
    setTheme(
      (currentTheme) => themes[(themes.indexOf(currentTheme) + 1) % themes.length] ?? 'github-light'
    );
  }

  return {
    theme,
    fontSize,
    setFontSize: (updater: (fontSize: number) => number) =>
      setFontSize((currentFontSize) => clampFontSize(updater(currentFontSize))),
    toggleTheme,
  };
}
