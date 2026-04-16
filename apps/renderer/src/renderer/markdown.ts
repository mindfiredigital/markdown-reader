import { marked } from 'marked';

// converts markdown test into plain HTML string
export async function renderMarkdown(markdownText: string): Promise<string> {
  const result = await marked.parse(markdownText);

  if (typeof result === 'string') {
    return result;
  }

  return '';
}

// function for sikhi to highlight all code blocks
export async function renderMarkdownAsync(markdownText: string): Promise<string> {
  if (!markdownText || markdownText.trim() === '') {
    return '';
  }
  return await marked.parse(markdownText);
}
