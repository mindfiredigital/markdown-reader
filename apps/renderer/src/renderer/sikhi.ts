import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Promise<Highlighter> | null = null;

// create sikhi highligher with theme and languages.
export async function sikhiHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['java', 'javascript', 'typescript', 'c'],
    });
  }
  return highlighter;
}
