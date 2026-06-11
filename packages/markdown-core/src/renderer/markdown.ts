import { getMarkdown } from '../config/marked';
import { createHeadingRegistry } from '../utils/helper/heading-helper';
import { parseCallouts } from './callout';

// converts markdown text into plain HTML string
export async function renderMarkdown(markdownText: string): Promise<string> {
  const registry = createHeadingRegistry();

  if (!markdownText || markdownText.trim() === '') {
    return '';
  }

  const marked = getMarkdown(registry);
  let result = await marked.parse(markdownText);
  if (result.includes('$')) {
    const { processAllMath } = await import('./katex');
    result = await processAllMath(result);
  }
  if (result.includes('language-mermaid')) {
    const { processMermaid } = await import('./mermaid');
    result = await processMermaid(result);
  }
  result = parseCallouts(result);

  return result;
}
