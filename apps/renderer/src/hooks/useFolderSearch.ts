import { useCallback, useState, useRef } from 'react';
import { FolderSearchResult } from '@package/shared-types';

export function useFolderSearch(folderPath: string | null) {
  const [isFolderSearchOpen, setIsFolderSearchOpen] = useState(false);
  const [folderQuery, setFolderQuery] = useState('');
  const [folderResults, setFolderResults] = useState<FolderSearchResult[]>([]);
  const [isSearchingFolder, setIsSearchingFolder] = useState(false);
  const requestId = useRef(0);

  const openFolderSearch = useCallback(() => setIsFolderSearchOpen(true), []);
  const closeFolderSearch = useCallback(() => {
    setIsFolderSearchOpen(false);
    setFolderQuery('');
    setFolderResults([]);
  }, []);

  const searchFolder = useCallback(
    async (query: string) => {
      setFolderQuery(query);
      if (!folderPath || !query.trim() || !window.api?.searchFolder) {
        setFolderResults([]);
        return;
      }
      const current = ++requestId.current;
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
