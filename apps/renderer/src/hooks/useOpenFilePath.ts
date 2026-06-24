import { useEffect } from 'react';
import { usePlatformAPI } from '../hooks/usePlatform';

export function useOpenFilePath(loadFileInTab: (path: string) => Promise<void>) {
  const api = usePlatformAPI();
  useEffect(() => {
    if (!api.onOpenFilePath || !api.removeOpenFilePathListener) return;
    api.onOpenFilePath((path) => {
      void loadFileInTab(path);
    });
    return () => {
      api.removeOpenFilePathListener?.();
    };
  }, [loadFileInTab, api]);
}
