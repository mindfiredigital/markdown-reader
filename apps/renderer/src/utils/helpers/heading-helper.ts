import { HeadingProps } from '../../types/component-types';
import { SLUG_PATTERNS, HTML_PATTERNS } from '../constants/regex-constants';
import { parseInline, type Tokens } from 'marked';

// converts heading text into a ID
export function getHeadingId(text: string): string {
  let id = text.toLowerCase();
  id = id.replace(SLUG_PATTERNS.NON_WORD, '');
  id = id.replace(SLUG_PATTERNS.SPACES, '-');
  id = id.trim().replace(SLUG_PATTERNS.TRIM_HYPHENS, '');

  return id;
}

// assigns id to the headings
export function heading({ text, depth }: HeadingProps) {
  const plainText = stripHtml(text);
  const id = getHeadingId(plainText);
  const safeText = escapeHtml(plainText);
  return `<h${depth} id="${id}">${safeText}</h${depth}>\n`;
}

//removes inline html
export function stripHtml(html: string): string {
  const strip = html.replace(HTML_PATTERNS.ANY_TAG, '');
  return strip;
}

export function headingText(token: Tokens.Heading): string {
  const inlineHtml = parseInline(token.text) as string;
  return stripHtml(inlineHtml).trim();
}

export function isHeadingToken(token: unknown): token is Tokens.Heading {
  return !!token && typeof token === 'object' && (token as { type?: string }).type === 'heading';
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function decodeHtml(value: string): string {
  return value
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#039;', "'");
}
