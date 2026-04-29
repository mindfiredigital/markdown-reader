import { StatusBarProps } from "../types/component-types";
import { basename } from "../utils/path-helper";

export function StatusBar({ filePath, theme, fontSize }: StatusBarProps) {
  const zoomPercent = Math.round((fontSize / 16) * 100);
  const displayName = filePath ? basename(filePath) : '_';

  return (
    <footer className="flex items-center justify-between h-7 px-4 border-t text-xs shrink-0">
      <span className="truncate max-w-[50%]" title={filePath}>{displayName}</span>
      <span className="text-center">{theme}</span>
      <span className="text-right">{zoomPercent}%</span>
    </footer>
  );
}