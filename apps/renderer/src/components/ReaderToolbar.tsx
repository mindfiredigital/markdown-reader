import { useState, useRef, useEffect } from 'react';
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
  isExtension = false,
  onOpenFile,
  onOpenSettings,
  onOpenSearch,
  updateVersion,
  onDownloadUpdate,
  onExportHtml,
  onExportPdf,
  onExportDocx,
}: ReaderToolbarProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exportOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [exportOpen]);

  // Collapsed state - show only a small toggle button
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="absolute right-5 top-5 z-30 rounded-lg border border-border-theme bg-surface p-2 shadow-sm text-text-muted hover:text-text-base hover:bg-accent-bg transition-all duration-200"
        aria-label="Show toolbar"
      >
        <Icons.Settings size={16} />
      </button>
    );
  }

  return (
    <div 
      role="toolbar" 
      aria-label="Reader settings and action toolbar" 
      className="absolute right-5 top-5 z-30 flex items-center gap-1 rounded-xl border border-border-theme bg-surface px-2 py-1 shadow-sm transition-all duration-200"
    >
      {/* Hide button */}
      <button
        type="button"
        onClick={() => setCollapsed(true)}
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label="Hide toolbar"
      >
        <Icons.X size={14} />
      </button>

      <div aria-hidden="true" className="mx-0.5 h-5 w-px bg-border-theme" />

      {/* Extension Specific Controls */}
      {isExtension && (
        <>
          {onOpenFile && (
            <button
              type="button"
              onClick={onOpenFile}
              className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-accent"
              aria-label="Open new file"
            >
              <Icons.FileText size={17} />
            </button>
          )}

          {onOpenSearch && (
            <button
              type="button"
              onClick={onOpenSearch}
              className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-accent"
              aria-label="Search text in document"
            >
              <Icons.Search size={17} />
            </button>
          )}

          {onOpenSettings && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-accent"
              aria-label="Open settings"
            >
              <Icons.Settings size={17} />
            </button>
          )}

          {/* Export dropdown */}
          {(onExportHtml || onExportPdf || onExportDocx) && (
            <div ref={exportRef} className="relative">
              <button
                type="button"
                onClick={() => setExportOpen(!exportOpen)}
                className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-accent"
                aria-label="Export document"
                aria-expanded={exportOpen}
              >
                <Icons.Download size={17} />
              </button>
              {exportOpen && (
                <div className="absolute right-0 top-full mt-1.5 min-w-[140px] rounded-lg border border-border-theme bg-surface shadow-lg py-1 z-50">
                  {onExportHtml && (
                    <button
                      type="button"
                      onClick={() => { onExportHtml(); setExportOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-sm text-text-base hover:bg-accent-bg hover:text-accent transition-colors"
                    >
                      Export as HTML
                    </button>
                  )}
                  {onExportPdf && (
                    <button
                      type="button"
                      onClick={() => { onExportPdf(); setExportOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-sm text-text-base hover:bg-accent-bg hover:text-accent transition-colors"
                    >
                      Export as PDF
                    </button>
                  )}
                  {onExportDocx && (
                    <button
                      type="button"
                      onClick={() => { onExportDocx(); setExportOpen(false); }}
                      className="w-full text-left px-3 py-1.5 text-sm text-text-base hover:bg-accent-bg hover:text-accent transition-colors"
                    >
                      Export as DOCX
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div aria-hidden="true" className="mx-1 h-5 w-px bg-border-theme" />
        </>
      )}

      {/* Font Zoom Controls */}
      <button
        type="button"
        onClick={onZoomOut}
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label="Zoom out"
      >
        <Icons.ZoomOut size={17} />
      </button>
      <button
        type="button"
        onClick={onZoomReset}
        className="min-w-12 rounded-md px-2 py-1 text-xs font-semibold text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label={`Reset zoom, current size ${fontSize} pixels`}
      >
        {fontSize}px
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label="Zoom in"
      >
        <Icons.ZoomIn size={17} />
      </button>

      <div aria-hidden="true" className="mx-1 h-5 w-px bg-border-theme" />

      {/* Theme Toggle */}
      <button
        type="button"
        onClick={onToggleTheme}
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label="Toggle theme"
      >
        {theme === 'github-dark' || theme === 'dracula' || theme === 'nord' ? (
          <Icons.Sun size={17} />
        ) : (
          <Icons.Moon size={17} />
        )}
      </button>

      {/* Update Action Desktop & Extension */}
      {updateVersion && (
        <>
          <div aria-hidden="true" className="mx-1 h-5 w-px bg-border-theme" />
          <button
            type="button"
            onClick={onDownloadUpdate}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-accent text-white hover:bg-accent/90 shadow-sm transition-all duration-150 animate-pulse"
            aria-label={`Update available: v${updateVersion}. Click to install.`}
          >
            <Icons.Sparkles size={13} stroke="currentColor" fill="white" />
            Update v{updateVersion}
          </button>
        </>
      )}
    </div>
  );
}
