import { FONT_SIZE_INCREMENT, MAX_FONT_SIZE, MIN_FONT_SIZE } from '@package/shared-constants';
import { ToolbarProps } from '../types';
import { Icons } from '@package/markdown-core';

export function Toolbar({
  fileName,
  query,
  matchCount,
  currentMatch,
  onOpenFile,
  onQueryChange,
  onPreviousMatch,
  onNextMatch,
  onToggleTheme,
  onFontSizeChange,
}: ToolbarProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <strong>Markdown Reader</strong>
        <span>{fileName ?? 'No file selected'}</span>
      </div>
      <div className="controls">
        <button type="button" onClick={onOpenFile}>
          Open .md
        </button>
        <label className="search">
          <span>Search</span>
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} />
        </label>
        <button type="button" disabled={!matchCount} onClick={onPreviousMatch}>
          <Icons.ArrowUp size={18} />
        </button>
        <button type="button" disabled={!matchCount} onClick={onNextMatch}>
          <Icons.ArrowDown size={18} />
        </button>
        <span className="match-count">{matchCount ? `${currentMatch}/${matchCount}` : '0/0'}</span>
        <button type="button" onClick={onToggleTheme}>
          Theme
        </button>
        <button
          type="button"
          onClick={() =>
            onFontSizeChange((fontSize) => Math.max(MIN_FONT_SIZE, fontSize - FONT_SIZE_INCREMENT))
          }
        >
         <Icons.ZoomIn size={18} />
        </button>
        <button
          type="button"
          onClick={() =>
            onFontSizeChange((fontSize) => Math.min(MAX_FONT_SIZE, fontSize + FONT_SIZE_INCREMENT))
          }
        >
          <Icons.ZoomOut size={18} />
        </button>
      </div>
    </header>
  );
}
