import { describe, it, expect } from 'vitest';
import { tabReducer } from '../../src/store/tabStore';
import { TabState, TabAction } from '../../src/types/component-types';
import { createTab } from '../../src/utils/helpers/tab-helper';
const empty: TabState = {
  tabs: [],
  activeTabId: null,
};

describe('tab reducer test', () => {
  it('OPEN_TAB should add a new tab and set as active', () => {
    const action: TabAction = {
      type: 'OPEN_TAB',
      payload: {
        filePath: '/README.md',
      },
    };
    const next = tabReducer(empty, action);
    expect(next.tabs).toHaveLength(1);
    expect(next.tabs[0]?.filePath).toBe('/README.md');
    expect(next.activeTabId).toBe(next.tabs[0]?.id);
  });
  it('SWITCH_TAB should set activeTabId to the specified tab', () => {
    const tab1 = createTab('/tab1.md');
    const tab2 = createTab('/tab2.md');
    const switchTab2: TabState = {
      tabs: [tab1, tab2],
      activeTabId: tab2.id,
    };
    const next = tabReducer(switchTab2, { type: 'SWITCH_TAB', payload: { tabId: tab2.id } });
    expect(next.activeTabId).toBe(tab2.id);
  });

  it('closing active tabs should activate the previous tabs', () => {
    const tab1 = createTab('/tab1.md');
    const tab2 = createTab('/tab2.md');
    const closeTab2: TabState = {
      tabs: [tab1, tab2],
      activeTabId: tab2.id,
    };
    const next = tabReducer(closeTab2, { type: 'CLOSE_TAB', payload: { tabId: tab2.id } });
    expect(next.activeTabId).toBe(tab1.id);
  });

  it('UPDATE_TAB_STATE updates scrollTop for one tab without touching others', () => {
    const t1 = createTab('/a.md');
    const t2 = createTab('/b.md');
    const updateTab2: TabState = {
      tabs: [t1, t2],
      activeTabId: t1.id,
    };
    const next = tabReducer(updateTab2, {
      type: 'UPDATE_TAB_STATE',
      payload: {
        tabId: t1.id,
        scrollTop: 500,
      },
    });
    expect(next.tabs[0]?.scrollTop).toBe(500);
    expect(next.tabs[1]?.scrollTop).toBe(0);
  });

  it('OPEN_TAB for an already open file switches to it, no duplicate', () => {
    const tab = createTab('/README.md');
    const openTab1: TabState = {
      tabs: [tab],
      activeTabId: tab.id,
    };
    const next = tabReducer(openTab1, {
      type: 'OPEN_TAB',
      payload: {
        filePath: '/README.md',
      },
    });
    expect(next.tabs).toHaveLength(1);
  });
});
