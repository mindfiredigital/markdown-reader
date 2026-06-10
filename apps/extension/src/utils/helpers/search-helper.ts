export function createSearchRegex(query: string): RegExp {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(${escaped})(?![^<]*>)`, 'gi');
}

export function highlightHtml(html: string, query: string): string {
  if (!query.trim()) return html;
  return html.replace(createSearchRegex(query), '<mark class="search-match">$1</mark>');
}

export function countMatches(html: string, query: string): number {
  if (!query.trim()) return 0;
  return html.match(createSearchRegex(query))?.length ?? 0;
}
