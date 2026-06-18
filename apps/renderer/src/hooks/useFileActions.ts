import { useCallback, useState } from 'react';
import { FileType } from '@package/shared-types';
import { FileActionProps } from '../types/hook-types';
import { usePlatformAPI } from '../hooks/usePlatform';

export function useFileActions({ loadFile, dispatch }: FileActionProps) {
  const api = usePlatformAPI();
  const [folderTree, setFolderTree] = useState<FileType | null>(null);
  const [folderPath, setFolderPath] = useState<string | null>(null);

  const openFolder = useCallback(async () => {
    if (!api.openFolderDialog || !api.readFolder) return;
    const folderPath = await api.openFolderDialog();
    if (!folderPath) return;
    const tree = await api.readFolder(folderPath);
    setFolderTree(tree);
    setFolderPath(folderPath);
  }, [api]);

  const loadFileInTab = useCallback(
    async (path: string) => {
      const result = await loadFile(path);
      if (!result) return;
      dispatch({
        type: 'OPEN_TAB',
        payload: {
          filePath: result.filePath,
          html: result.html,
          ...(result.toc ? { toc: result.toc } : {}),
        },
      });
    },
    [loadFile, dispatch]
  );

  const openFileDialog = useCallback(() => {
    if (!api.openFileDialog) return;
    void api.openFileDialog().then((chosenPath) => {
      if (chosenPath) {
        void loadFileInTab(chosenPath);
      }
    });
  }, [loadFileInTab, api]);

  return { folderTree, folderPath, setFolderTree, openFolder, loadFileInTab, openFileDialog };
}
