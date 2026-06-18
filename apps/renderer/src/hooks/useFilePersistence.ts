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
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
        debounceTimer.current = undefined;
      }
      if (scrollTimer.current) {
        window.clearTimeout(scrollTimer.current);
        scrollTimer.current = undefined;
      }
    };
  }, []);

  const handleFileChange = useCallback(() => {
    if (!activeTab) return;
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = window.setTimeout(async () => {
      const currentScroll = contentRef.current?.scrollTop ?? 0;
      const result = await loadFile(activeTab.filePath);
      if (!result || !isMounted.current) return;
      dispatch({
        type: 'UPDATE_TAB_STATE',
        payload: {
          tabId: activeTab.id,
          html: result.html,
          ...(result.toc ? { toc: result.toc } : {}),
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
      window.clearTimeout(scrollTimer.current);
    }

    scrollTimer.current = window.setTimeout(() => {
      if (!isMounted.current || !contentRef.current) return;
      saveScrollPos(activeTab.filePath, contentRef.current.scrollTop);

      dispatch({
        type: 'UPDATE_TAB_STATE',
        payload: {
          tabId: activeTab.id,
          scrollTop: contentRef.current.scrollTop,
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
  }, [activeTab?.id, activeTab?.html, contentRef]);

  return { scroll };
}
