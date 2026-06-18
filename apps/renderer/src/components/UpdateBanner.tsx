import { useEffect, useState } from 'react';
import { Icons } from '../utils/constants/icon-contants';
import { usePlatformAPI } from '../hooks/usePlatform';

export function UpdateBanner() {
  const [updateVersion, setUpdateVersion] = useState<string | null>(null);
  const api=usePlatformAPI();
  useEffect(() => {
    if(!api.onUpdateAvailable) return;
    const removeUpdateAvailable=api.onUpdateAvailable((version: string) => {
      setUpdateVersion(version);
    });
    return removeUpdateAvailable;
  }, [api]);
  if (!updateVersion) {
    return null;
  }

  return (
    <div role="region" aria-label="Application update banner" className="bg-accent-bg border-b border-border-theme px-4 py-2 flex items-center gap-3 text-sm">
      <span className="text-text-base font-medium">
        Update available: v{updateVersion}
      </span>
      <button
        type="button"
        onClick={() => {
          if (api.downloadUpdate) {
            api.downloadUpdate();
          }
        }}
        className="text-accent hover:underline"
        aria-label={`Download update version ${updateVersion} and install on quit`}
      >
        Download & install on quit
      </button>

      <button
        type="button"
        onClick={() => setUpdateVersion(null)}
        className="ml-auto text-text-muted hover:text-text-base"
        aria-label="Dismiss update notification"
      >
      <Icons.X size={16}/>
      </button>
    </div>
  );
}