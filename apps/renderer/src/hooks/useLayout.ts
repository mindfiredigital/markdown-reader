import { useState, useCallback } from 'react';

export function useLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fileBrowserOpen, setFileBrowserOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const toggleFileBrowser = useCallback(() => {
    setFileBrowserOpen((prev) => !prev);
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusMode((prev) => !prev);
  }, []);

  return {
    sidebarOpen,
    setSidebarOpen,
    fileBrowserOpen,
    setFileBrowserOpen,
    focusMode,
    toggleFocusMode,
    toggleSidebar,
    toggleFileBrowser,
  };
}
