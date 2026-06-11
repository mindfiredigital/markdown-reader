import { useEffect,useRef } from 'react';
import { SettingsPanelProps } from '../types/component-types';
import { Icons } from '@package/markdown-core';
import { WIDTH_MAP } from '../types/component-types';

/*Displays the settings features in UI*/
export function SettingsPanel({
  settings,
  isOpen,
  onClose,
  onChange,
  appVersion,
}: SettingsPanelProps) {
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
      if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
   return () => previouslyFocused?.focus();
    
  }, [isOpen]);

  useEffect(()=>{
    if(!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);

  }, [isOpen, onClose])
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <section
        ref={dialogRef}
        tabIndex={-1}
        onClick={(e)=>e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="w-full max-w-xl rounded-lg border border-border-theme bg-bg shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-border-theme px-4 py-3">
          <h2 id="settings-title" className="text-base font-semibold text-text-base">
            Settings
          </h2>
          <button type="button" aria-label="Close settings" onClick={onClose} className="p-1">
            <Icons.X size={18} />
          </button>
        </header>

        <div className="space-y-5 p-4">
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-text-base">Reading width</legend>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Reading width choices">
              {(['narrow', 'default', 'wide'] as const).map((width) => (
                <label
                  key={width}
                  className="flex cursor-pointer items-center gap-2 rounded border border-border-theme px-3 py-2 text-sm"
                >
                  <input
                    type="radio"
                    name="readingWidth"
                    value={width}
                    checked={settings.readingWidth === width}
                    onChange={() => onChange({ readingWidth: width })}
                  />
                  <span className="capitalize">{width}</span>
                  <span className="text-xs text-text-muted" aria-label={`Width value: ${WIDTH_MAP[width]}`}>{WIDTH_MAP[width]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center gap-2 text-sm text-text-base">
            <input
              type="checkbox"
              checked={settings.lineNumbers}
              onChange={(event) => onChange({ lineNumbers: event.target.checked })}
            />
            Show code line numbers
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-text-base">Custom CSS</span>
            <textarea
              value={settings.customCss}
              onChange={(event) => onChange({ customCss: event.target.value })}
              rows={8}
              aria-labelledby="custom-css-title"
              className="w-full resize-y rounded border border-border-theme bg-surface p-3 font-mono text-sm text-text-base outline-none focus:ring-2 focus:ring-accent"
              placeholder="Add custom reader CSS here "
            />
            <span id="custom-css-title" className="sr-only">Custom CSS input editor</span> 
          </label>

          {appVersion && <p className="text-xs text-text-muted" aria-label={`Application Version ${appVersion}`}>Version {appVersion}</p>}
        </div>
      </section>
    </div>
  );
}
