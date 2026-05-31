import { useCallback, useState } from 'react';
import { FileType } from '@package/shared-types';
import { FileActionProps } from '../types/hook-types';

export function useFileActions({ loadFile, dispatch }: FileActionProps) {
  const [folderTree, setFolderTree] = useState<FileType | null>(null);

  const openFolder = useCallback(async () => {
    const folderPath = await window.api.openFolderDialog();
    if (!folderPath) return;
    const tree = await window.api.readFolder(folderPath);
    setFolderTree(tree);
  }, []);

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
    void window.api.openFileDialog().then((chosenPath) => {
      if (chosenPath) {
        void loadFileInTab(chosenPath);
      }
    });
  }, [loadFileInTab]);

  return { folderTree, setFolderTree, openFolder, loadFileInTab, openFileDialog };
}
