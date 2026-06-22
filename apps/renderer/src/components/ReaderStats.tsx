import { ReaderStatsProps } from "../types/component-types";
import { formatBytes } from "../utils/helpers/size-helper";

// it will show the number of lines,size of the md file
export function ReaderStats({ markdown }: ReaderStatsProps) {
  if (!markdown) return null;

  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  const lineCount = markdown.split('\n').length;
  const byteSize = new Blob([markdown]).size;

  return (
    <div 
      className="absolute bottom-12 right-6 z-20 flex items-center gap-3 rounded-full border border-border-theme bg-surface/90 px-4 py-1.5 text-xs text-text-muted shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-surface hover:text-text-base hover:shadow"
      aria-label="Document statistics"
    >
      <span className="font-medium">{wordCount.toLocaleString()} words</span>
      <span aria-hidden="true" className="h-3 w-px bg-border-theme" />
      <span className="font-medium">{lineCount.toLocaleString()} lines</span>
      <span aria-hidden="true" className="h-3 w-px bg-border-theme" />
      <span className="font-mono">{formatBytes(byteSize)}</span>
    </div>
  );
}
