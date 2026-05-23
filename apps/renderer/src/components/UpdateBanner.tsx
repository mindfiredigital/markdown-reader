import { useEffect, useState } from 'react';
import { Icons } from '../utils/constants/icon-contants';

export function UpdateBanner() {
  const [updateVersion, setUpdateVersion] = useState<string | null>(null);
  useEffect(() => {
    window.api.onUpdateAvailable((version: string) => {
      setUpdateVersion(version);
    });
  }, []);
  if (!updateVersion) {
    return null;
  }

  return (
    <div className="bg-accent-bg border-b border-border-theme px-4 py-2 flex items-center gap-3 text-sm">
      <span className="text-text-base font-medium">
        Update available: v{updateVersion}
      </span>
      <button
        type="button"
        onClick={() => {
          void window.api.downloadUpdate();
        }}
        className="text-accent hover:underline"
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