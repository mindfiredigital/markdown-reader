import { useCallback, useState } from 'react';
import { FolderSearchResult } from '@package/shared-types';

export function useFolderSearch(folderPath: string | null) {
  const [isFolderSearchOpen, setIsFolderSearchOpen] = useState(false);
  const [folderQuery, setFolderQuery] = useState('');
  const [folderResults, setFolderResults] = useState<FolderSearchResult[]>([]);
  const [isSearchingFolder, setIsSearchingFolder] = useState(false);

  const openFolderSearch = useCallback(() => setIsFolderSearchOpen(true), []);
  const closeFolderSearch = useCallback(() => {
    setIsFolderSearchOpen(false);
    setFolderQuery('');
    setFolderResults([]);
  }, []);

  const searchFolder = useCallback(
    async (query: string) => {
      setFolderQuery(query);
      if (!folderPath || !query.trim()) {
        setFolderResults([]);
        return;
      }

      setIsSearchingFolder(true);
      try {
        const results = await window.api.searchFolder(folderPath, query);
        setFolderResults(results);
      } finally {
        setIsSearchingFolder(false);
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
