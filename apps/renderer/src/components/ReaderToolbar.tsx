import { Icons } from '../utils/constants/icon-contants';
import { ReaderToolbarProps } from '../types/component-types';

/* toolbar component to show zoom controls and theme toggle on UI */
export function ReaderToolbar({
  fontSize,
  theme,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToggleTheme,
}: ReaderToolbarProps) {
  return (
    <div className="absolute right-5 top-5 z-30 flex items-center gap-1 rounded-xl border border-border-theme bg-surface px-2 py-1 shadow-sm">
      <button
        onClick={onZoomOut}
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label="Zoom out"
      >
        <Icons.ZoomOut size={18} />
      </button>
      <button
        onClick={onZoomReset}
        className="min-w-12 rounded-md px-2 py-1 text-xs font-medium text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
      >
        {fontSize}px
      </button>
      <button
        onClick={onZoomIn}
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label="Zoom in"
      >
        <Icons.ZoomIn size={18} />
      </button>
      <div className="mx-1 h-5 w-px bg-border-theme" />
      <button
        onClick={onToggleTheme}
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label="Toggle theme"
      >
        {theme === 'github-dark' || theme === 'dracula' || theme === 'nord' ? (
          <Icons.Sun size={18} />
        ) : (
          <Icons.Moon size={18} />
        )}
      </button>
    </div>
  );
}
