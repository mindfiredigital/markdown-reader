import { useEffect } from 'react';

export function useOpenFilePath(loadFileInTab: (path: string) => Promise<void>) {
  useEffect(() => {
    window.api.onOpenFilePath((path) => {
      void loadFileInTab(path);
    });
    return () => {
      window.api.removeOpenFilePathListener();
    };
  }, [loadFileInTab]);
}
