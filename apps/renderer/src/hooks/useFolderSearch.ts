import { useCallback, useState, useRef, useEffect } from 'react';
import { FolderSearchResult } from '@package/shared-types';

export function useFolderSearch(folderPath: string | null) {
  const [isFolderSearchOpen, setIsFolderSearchOpen] = useState(false);
  const [folderQuery, setFolderQuery] = useState('');
  const [folderResults, setFolderResults] = useState<FolderSearchResult[]>([]);
  const [isSearchingFolder, setIsSearchingFolder] = useState(false);
  const requestId = useRef(0);

  const openFolderSearch = useCallback(() => setIsFolderSearchOpen(true), []);
  const closeFolderSearch = useCallback(() => {
    requestId.current += 1;
    setIsFolderSearchOpen(false);
    setFolderQuery('');
    setFolderResults([]);
  }, []);

  const searchFolder = useCallback(
    async (query: string) => {
      setFolderQuery(query);
      const current = ++requestId.current;
      if (!folderPath || !query.trim() || !window.api?.searchFolder) {
        setFolderResults([]);
        setIsSearchingFolder(false);
        return;
      }

      setIsSearchingFolder(true);
      try {
        const results = await window.api.searchFolder(folderPath, query);
        if (current === requestId.current) setFolderResults(results);
      } catch {
        if (current === requestId.current) setFolderResults([]);
      } finally {
        if (current === requestId.current) setIsSearchingFolder(false);
      }
    },
    [folderPath]
  );

  useEffect(() => {
    return () => {
      requestId.current += 1;
    };
  }, []);

  return {
    isFolderSearchOpen,
    folderQuery,
    folderResults,
    isSearchingFolder,
    openFolderSearch,
    closeFolderSearch,
    searchFolder,
  };
}
