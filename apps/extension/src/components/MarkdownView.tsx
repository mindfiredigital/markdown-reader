import { MarkdownViewProps } from "../types";

export function MarkdownView({ html }: MarkdownViewProps) {
  return <article className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />;
}
