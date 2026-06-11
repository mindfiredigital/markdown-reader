import { useEffect, useMemo, useState } from 'react';
import { countMatches, highlightHtml } from '../utils/helpers/search-helper';

export function useDocumentSearch(html: string) {
  const [query, setQuery] = useState('');
  const [currentMatch, setCurrentMatch] = useState(0);

  const highlightedHtml = useMemo(() => highlightHtml(html, query), [html, query]);
  const matchCount = useMemo(() => countMatches(html, query), [html, query]);

  useEffect(() => {
    setCurrentMatch(matchCount ? 1 : 0);
  }, [matchCount, query]);

  function goToMatch(direction: 1 | -1) {
    if (!matchCount) return;
    setCurrentMatch((match) => {
      const next = match + direction;
      if (next < 1) return matchCount;
      if (next > matchCount) return 1;
      return next;
    });
  }

  return {
    query,
    setQuery,
    highlightedHtml,
    matchCount,
    currentMatch,
    goToPreviousMatch: () => goToMatch(-1),
    goToNextMatch: () => goToMatch(1),
    clearSearch: () => setQuery(''),
  };
}
