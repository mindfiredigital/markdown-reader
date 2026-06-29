import { useCallback, useState } from 'react';
import { ViewMode } from '../types/component-types';
import { MARKDOWN_TOGGLE } from '../utils/constants/markdown-constants';

export function useViewMode(initialMode: ViewMode = MARKDOWN_TOGGLE.RENDERED) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const toggleRawText = useCallback(() => {
    setViewMode((prev) =>
      prev === MARKDOWN_TOGGLE.RAW ? MARKDOWN_TOGGLE.RENDERED : MARKDOWN_TOGGLE.RAW
    );
  }, []);

  const toggleMindMap = useCallback(() => {
    setViewMode((prev) =>
      prev === MARKDOWN_TOGGLE.MINDMAP ? MARKDOWN_TOGGLE.RENDERED : MARKDOWN_TOGGLE.MINDMAP
    );
  }, []);

  return {
    viewMode,
    setViewMode,
    toggleRawText,
    toggleMindMap,
  };
}
