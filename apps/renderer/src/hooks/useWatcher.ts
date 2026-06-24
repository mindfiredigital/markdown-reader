import { useEffect } from 'react';
import { usePlatformAPI } from '../hooks/usePlatform';

export function useWatcher(filePath: string, onFileChanged: (path: string) => void) {
  const api = usePlatformAPI();
  useEffect(() => {
    if (!filePath) return;
    void api.watchFile(filePath).catch((e) => console.warn('Failed to watch file:', e));
    const handler = (path: string) => {
      onFileChanged(path);
    };
    api.onFileChanged(handler);
    return () => {
      void api.unWatchFile(filePath).catch((e) => console.warn('Failed to unwatch file:', e));
      api.removeFileChangedListener();
    };
  }, [filePath, onFileChanged, api]);
}
