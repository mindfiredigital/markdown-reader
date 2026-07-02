import { useState, useRef, useEffect } from 'react';
import { logger } from '../utils/helpers/logger';
import { Icons } from '../utils/constants/icon-contants';
import { ReaderToolbarProps } from '../types/component-types';
import { ICON_TITLE, MARKDOWN_TOGGLE } from '../utils/constants/markdown-constants';

/* toolbar component to show zoom controls and theme toggle on UI */
export function ReaderToolbar({
  fontSize,
  theme,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToggleTheme,
  onOpenFile,
  onOpenSettings,
  onOpenSearch,
  updateVersion,
  onDownloadUpdate,
  onExportHtml,
  onExportPdf,
  onExportDocx,
  onCopyMd,
  onCopyText,
  viewMode,
  onToggleRawText,
  onToggleMindMap,
}: ReaderToolbarProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exportOpen && !copyOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (exportOpen && exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
      if (copyOpen && copyRef.current && !copyRef.current.contains(e.target as Node)) {
        setCopyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [exportOpen, copyOpen]);

  // Collapsed state - show only a small toggle button
  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="absolute right-5 top-5 z-30 flex items-center justify-center w-12 h-12 rounded-xl border border-border-theme bg-surface shadow-sm text-text-muted hover:text-text-base hover:bg-accent-bg transition-all duration-200"
        aria-label="Show toolbar"
        title="Show toolbar"
      >
        <Icons.Settings size={16} />
      </button>
    );
  }

  return (
    <div 
      role="toolbar" 
      aria-label="Reader settings and action toolbar" 
      className="absolute right-5 top-5 z-30 flex flex-col items-center gap-1 w-12 rounded-xl border border-border-theme bg-surface py-2 shadow-sm transition-all duration-200"
    >
      {/* Hide button */}
      <button
        type="button"
        onClick={() => setCollapsed(true)}
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label="Hide toolbar"
        title="Hide toolbar"
      >
        <Icons.X size={14} />
      </button>

      <div aria-hidden="true" className="my-0.5 h-px w-5 bg-border-theme" />

      {/* Optional Platform Controls */}
      {onOpenFile && (
            <button
              type="button"
              onClick={onOpenFile}
              className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-accent"
              aria-label="Open new file"
              title="Open new file"
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
              title="Search text in document"
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
              title="Open settings"
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
                title="Export document"
                aria-controls="export-menu"
                aria-expanded={exportOpen}
              >
                <Icons.Download size={17} />
              </button>
              {exportOpen && (
                <div
                  id="export-menu"
                  role="menu"
                  aria-label="Export options"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setExportOpen(false);
                  }}
                  className="absolute right-0 top-full mt-1.5 min-w-35 rounded-lg border border-border-theme bg-surface shadow-lg py-1 z-50"
                >
                  {onExportHtml && (
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setExportOpen(false);
                        void Promise.resolve(onExportHtml()).catch((e) => logger.error('Export HTML failed:', e));
                      }}
                      className="w-full text-left px-3 py-1.5 text-sm text-text-base hover:bg-accent-bg hover:text-accent transition-colors"
                    >
                      Export as HTML
                    </button>
                  )}
                  {onExportPdf && (
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setExportOpen(false);
                        void Promise.resolve(onExportPdf()).catch((e) => logger.error('Export PDF failed:', e));
                      }}
                      className="w-full text-left px-3 py-1.5 text-sm text-text-base hover:bg-accent-bg hover:text-accent transition-colors"
                    >
                      Export as PDF
                    </button>
                  )}
                  {onExportDocx && (
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setExportOpen(false);
                        void Promise.resolve(onExportDocx()).catch((e) => logger.error('Export DOCX failed:', e));
                      }}
                      className="w-full text-left px-3 py-1.5 text-sm text-text-base hover:bg-accent-bg hover:text-accent transition-colors"
                    >
                      Export as DOCX
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Copy dropdown */}
          {(onCopyMd || onCopyText) && (
            <div ref={copyRef} className="relative">
              <button
                type="button"
                onClick={() => setCopyOpen(!copyOpen)}
                className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-accent"
                aria-label="Copy document"
                title="Copy document"
                aria-controls="copy-menu"
                aria-expanded={copyOpen}
              >
                <Icons.Copy size={17} />
              </button>
              {copyOpen && (
                <div
                  id="copy-menu"
                  role="menu"
                  aria-label="Copy options"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setCopyOpen(false);
                  }}
                  className="absolute right-0 top-full mt-1.5 min-w-35 rounded-lg border border-border-theme bg-surface shadow-lg py-1 z-50"
                >
                  {onCopyMd && (
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setCopyOpen(false);
                        void Promise.resolve(onCopyMd()).catch((e) => logger.error('Copy MD failed:', e));
                      }}
                      className="w-full text-left px-3 py-1.5 text-sm text-text-base hover:bg-accent-bg hover:text-accent transition-colors"
                    >
                      Copy as Markdown
                    </button>
                  )}
                  {onCopyText && (
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => {
                        setCopyOpen(false);
                        void Promise.resolve(onCopyText()).catch((e) => logger.error('Copy Text failed:', e));
                      }}
                      className="w-full text-left px-3 py-1.5 text-sm text-text-base hover:bg-accent-bg hover:text-accent transition-colors"
                    >
                      Copy as Plain Text
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
      <div aria-hidden="true" className="my-1 h-px w-5 bg-border-theme" />

      {/* Raw Text Toggle */}
      {onToggleRawText && (
        <button
          type="button"
          onClick={onToggleRawText}
          className={`rounded-md p-2 transition-colors hover:bg-accent-bg ${viewMode === MARKDOWN_TOGGLE.RAW ? 'text-accent bg-accent-bg' : 'text-text-muted hover:text-text-base'}`}
          aria-label={viewMode === MARKDOWN_TOGGLE.RAW ? ICON_TITLE.SHOW_RENDERED_TEXT : ICON_TITLE.SHOW_RAW_TEXT}
          title={viewMode === MARKDOWN_TOGGLE.RAW ? ICON_TITLE.SHOW_RENDERED_TEXT : ICON_TITLE.SHOW_RAW_TEXT}
          aria-pressed={viewMode===MARKDOWN_TOGGLE.RAW}
        >
          <Icons.Code size={17} />
        </button>
      )}

      {/* Mind Map Toggle */}
      {onToggleMindMap && (
        <button
          type="button"
          onClick={onToggleMindMap}
          className={`rounded-md p-2 transition-colors hover:bg-accent-bg ${viewMode === MARKDOWN_TOGGLE.MINDMAP ? 'text-accent bg-accent-bg' : 'text-text-muted hover:text-text-base'}`}
          aria-label={viewMode === MARKDOWN_TOGGLE.MINDMAP ? ICON_TITLE.SHOW_RENDERED_TEXT : ICON_TITLE.SHOW_MIND_MAP}
          title={viewMode === MARKDOWN_TOGGLE.MINDMAP ? ICON_TITLE.SHOW_RENDERED_TEXT : ICON_TITLE.SHOW_MIND_MAP}
          aria-pressed={viewMode===MARKDOWN_TOGGLE.MINDMAP}
        >
          <Icons.MindMap size={17} />
        </button>
      )}

      {/* Font Zoom Controls */}
      <button
        type="button"
        onClick={onZoomOut}
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label="Zoom out"
        title="Zoom out"
      >
        <Icons.ZoomOut size={17} />
      </button>
      <button
        type="button"
        onClick={onZoomReset}
        className="w-full rounded-md text-center py-1 text-xs font-semibold text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label={`Reset zoom, current size ${fontSize} pixels`}
        title={`Reset zoom, current size ${fontSize} pixels`}
      >
        {fontSize}px
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label="Zoom in"
        title="Zoom in"
      >
        <Icons.ZoomIn size={17} />
      </button>

      <div aria-hidden="true" className="my-1 h-px w-5 bg-border-theme" />

      {/* Theme Toggle */}
      <button
        type="button"
        onClick={onToggleTheme}
        className="rounded-md p-2 text-text-muted transition-colors hover:bg-accent-bg hover:text-text-base"
        aria-label="Toggle theme"
        title="Toggle theme"
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
          <div aria-hidden="true" className="my-1 h-px w-5 bg-border-theme" />
          <button
            type="button"
            onClick={onDownloadUpdate}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-accent text-white hover:bg-accent/90 shadow-sm transition-all duration-150 animate-pulse"
            aria-label={`Update available: v${updateVersion}. Click to install.`}
            title={`Update available: v${updateVersion}. Click to install.`}
          >
            <Icons.Sparkles size={13} stroke="currentColor" fill="white" />
            Update v{updateVersion}
          </button>
        </>
      )}
    </div>
  );
}