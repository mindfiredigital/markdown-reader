import { useRef, useEffect, useCallback } from 'react';
import { useWatcher } from './useWatcher';
import { saveScrollPos, getScrollPos } from '../renderer/scroll';
import { FilePersistenceProps } from '../types/hook-types';

export function useFilePersistence({
  activeTab,
  loadFile,
  dispatch,
  contentRef,
  setShowToast,
}: FilePersistenceProps) {
  const debounceTimer = useRef<number | undefined>(undefined);
  const scrollTimer = useRef<number | undefined>(undefined);

  const handleFileChange = useCallback(() => {
    if (!activeTab) return;
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = window.setTimeout(async () => {
      const currentScroll = contentRef.current?.scrollTop ?? 0;
      const result = await loadFile(activeTab.filePath);
      if (!result) return;
      dispatch({
        type: 'UPDATE_TAB_STATE',
        payload: {
          tabId: activeTab.id,
          html: result.html,
        },
      });
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop = currentScroll;
        }
      });
      setShowToast(true);
    }, 150);
  }, [activeTab, loadFile, dispatch]);

  const scroll = () => {
    if (!activeTab || !contentRef.current) return;

    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = window.setTimeout(() => {
      saveScrollPos(activeTab.filePath, contentRef.current!.scrollTop);

      dispatch({
        type: 'UPDATE_TAB_STATE',
        payload: {
          tabId: activeTab.id,
          scrollTop: contentRef.current?.scrollTop ?? 0,
        },
      });
    }, 100);
  };
  useWatcher(activeTab?.filePath ?? '', handleFileChange);
  useEffect(() => {
    if (!activeTab || !contentRef.current) return;

    requestAnimationFrame(() => {
      if (contentRef.current) {
        contentRef.current.scrollTop = activeTab.scrollTop ?? getScrollPos(activeTab.filePath);
      }
    });
  }, [activeTab?.id, activeTab?.html]);

  return { scroll };
}
