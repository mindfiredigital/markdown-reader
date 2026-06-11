import { useCallback, useMemo, useState } from 'react';
import { TOCType } from '@package/shared-types';

export function useCollapsibleToc(tocItems: TOCType[]) {
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>({});

  const childMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (let i = 0; i < tocItems.length; i++) {
      const currentItem = tocItems[i];
      const nextItem = tocItems[i + 1];
      if (!currentItem) continue;
      map[currentItem.id] = nextItem ? nextItem.level > currentItem.level : false;
    }
    return map;
  }, [tocItems]);

  const toggleItem = useCallback(
    (id: string) => {
      setCollapsedItems((prev) => {
        const item = tocItems.find((tocItem) => tocItem.id === id);
        const isCurrentlyCollapsed = prev[id] ?? Boolean(item && item.level >= 2 && childMap[id]);
        return {
          ...prev,
          [id]: !isCurrentlyCollapsed,
        };
      });
    },
    [tocItems, childMap]
  );

  const visibleItems = useMemo(() => {
    const visible: TOCType[] = [];
    let activeHiddenLevel: number | null = null;

    for (const item of tocItems) {
      if (activeHiddenLevel !== null) {
        if (item.level > activeHiddenLevel) {
          continue;
        }
        activeHiddenLevel = null;
      }

      visible.push(item);
      const collapsed = collapsedItems[item.id] ?? (item.level >= 2 && childMap[item.id]);
      if (collapsed) {
        activeHiddenLevel = item.level;
      }
    }

    return visible;
  }, [tocItems, collapsedItems, childMap]);

  const hasChildren = useCallback((id: string) => Boolean(childMap[id]), [childMap]);

  const isCollapsed = useCallback(
    (id: string) => {
      const item = tocItems.find((tocItem) => tocItem.id === id);
      return Boolean(collapsedItems[id] ?? (item && item.level >= 2 && childMap[id]));
    },
    [childMap, collapsedItems, tocItems]
  );

  return {
    visibleItems,
    toggleItem,
    hasChildren,
    isCollapsed,
  };
}
