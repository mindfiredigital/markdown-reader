import { RawTextViewerProps } from "../types/component-types";

// It renders raw Markdown text in formatted code-style layout
export function RawTextViewer({ markdown }: RawTextViewerProps) {
  return (
    <pre className="p-8 whitespace-pre-wrap break-words font-mono text-sm leading-relaxed max-w-4xl mx-auto">
      {markdown ?? ''}
    </pre>
  );
}
