import { useCallback, useState } from 'react';
import { ViewMode } from '../types/component-types';

export function useViewMode(initialMode: ViewMode = 'rendered') {
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const toggleRawText = useCallback(() => {
    setViewMode((prev) => (prev === 'raw' ? 'rendered' : 'raw'));
  }, []);

  return {
    viewMode,
    setViewMode,
    toggleRawText,
  };
}
