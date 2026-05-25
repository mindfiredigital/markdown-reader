import React, { useCallback } from 'react';
import { TabAction, Tab } from '../types/component-types';

export function useTabNavigation(
  tabs: Tab[],
  activeTabId: string | null,
  dispatch: React.Dispatch<TabAction>
) {
  const goToNextTab = useCallback(() => {
    const idx = tabs.findIndex((tab) => tab.id === activeTabId);
    const next = tabs[idx + 1] || tabs[0];

    if (next) {
      dispatch({ type: 'SWITCH_TAB', payload: { tabId: next.id } });
    }
  }, [tabs, activeTabId, dispatch]);

  const goToPreviousTab = useCallback(() => {
    const idx = tabs.findIndex((tab) => tab.id === activeTabId);
    const prev = tabs[idx - 1] || tabs[tabs.length - 1];

    if (prev) {
      dispatch({ type: 'SWITCH_TAB', payload: { tabId: prev.id } });
    }
  }, [tabs, activeTabId, dispatch]);

  const closeActiveTab = useCallback(() => {
    if (!activeTabId) return;

    dispatch({
      type: 'CLOSE_TAB',
      payload: { tabId: activeTabId },
    });
  }, [activeTabId, dispatch]);

  return { goToNextTab, goToPreviousTab, closeActiveTab };
}
