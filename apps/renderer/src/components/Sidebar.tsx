import { useEffect,useRef } from 'react';
import { SidebarProps } from '../types/component-types';
import { Icons } from '../utils/constants/icon-contants';
import { getItemClasses } from '../utils/helpers/sidebar-helper';
import { useCollapsibleToc } from '../hooks/useCollapsibleToc';

//sidebar component
export function Sidebar({tocItems,activeId,onSelect,isVisible=true, onClose }: SidebarProps & { onClose: () => void }) {
  const { visibleItems, toggleItem, hasChildren, isCollapsed } = useCollapsibleToc(tocItems);
  const activeItemRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);
  if(!isVisible||tocItems.length===0){
    return null;
  }
  return (
    <nav className="w-64 border-r border-border-theme bg-surface overflow-y-auto py-5 shrink-0" aria-label="Table of contents">
      <div className="flex items-center justify-between px-4 pb-3 border-b border-border-theme">
        <h2 className="text-sm font-semibold tracking-wide text-text-base">
            Contents
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close table of contents"
          className="p-1 text-text-muted hover:text-text-base transition-colors"
        >
          <Icons.X size={18} />
        </button>
      </div>
      <ul className='py-2'>
        {visibleItems.map((item) => {
          const expandable = hasChildren(item.id);
          const collapsed = isCollapsed(item.id);

          return (
            <li key={item.id}>
              <div className="flex w-full items-stretch">
                <div className="flex w-7 shrink-0 justify-center">
                  {expandable ? (
                  <button
                    type="button"
                    aria-expanded={!collapsed}
                    aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${item.text}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleItem(item.id);
                    }}
                    className="inline-flex h-8 w-7 items-center justify-center text-text-muted hover:text-text-base transition-colors"
                  >
                    {collapsed ? (
                      <Icons.ChevronRight size={16} />
                    ) : (
                      <Icons.ChevronDown size={16} />
                    )}
                  </button>
                  ) : (
                    <span aria-hidden="true" className="block h-8 w-7" />
                  )}
                </div>
                <button ref={item.id===activeId ? activeItemRef : undefined} type="button" onClick={()=>onSelect(item.id)} className={`${getItemClasses(item, activeId)} min-w-0 flex-1`} aria-current={item.id===activeId?"location":undefined}>
                  <span>{item.text}</span>
                </button>
              </div>
            </li>
          )})}
      </ul>
    </nav>
  )
}