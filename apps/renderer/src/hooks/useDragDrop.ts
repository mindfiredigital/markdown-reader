import React, { useState, useEffect, useCallback } from 'react';
import { extractDroppedMdpath } from '../renderer/drag-drop';

export function useDragDrop(loadFileInTab: (path: string) => Promise<void>) {
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  useEffect(() => {
    const preventDefaultDrag = (e: DragEvent) => {
      e.preventDefault();
    };
    window.addEventListener('dragover', preventDefaultDrag);
    window.addEventListener('drop', preventDefaultDrag);

    return () => {
      window.removeEventListener('dragover', preventDefaultDrag);
      window.removeEventListener('drop', preventDefaultDrag);
    };
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingFile(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDraggingFile(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingFile(false);
      const droppedPath = extractDroppedMdpath(e.dataTransfer);
      if (droppedPath) {
        void loadFileInTab(droppedPath);
      }
    },
    [loadFileInTab]
  );

  return {
    isDraggingFile,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
