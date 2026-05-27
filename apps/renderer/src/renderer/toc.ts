import { lexer } from 'marked';
import { TOCType } from '../types/component-types';
import { getHeadingId, isHeadingToken, headingText } from '../utils/helpers/heading-helper';

// extracts table of content from HTML string
export function extractTOC(html: string): TOCType[] {
  const items: TOCType[] = [];
  const idCount = new Map<string, number>();
  const tokens = lexer(html);

  for (const token of tokens) {
    if (!isHeadingToken(token)) continue;

    const level = Math.min(token.depth, 3) as 1 | 2 | 3;
    const text = headingText(token);
    if (!text) continue;
    const firstid = getHeadingId(text);

    const count = idCount.get(firstid) ?? 0;
    idCount.set(firstid, count + 1);
    const id = count === 0 ? firstid : `${firstid}-${count}`;

    items.push({ id, text, level });
  }
  return items;
}
