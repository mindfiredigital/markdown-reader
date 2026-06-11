import { Icons } from '@package/markdown-core';
import { useCollapsibleToc } from '../hooks/useCollapsibleToc';
import { TocPanelProps } from '../types';

export function TocPanel({ items, scrollRoot }: TocPanelProps) {
  const { visibleItems, toggleItem, hasChildren, isCollapsed } = useCollapsibleToc(items);

  return (
    <aside className="toc" aria-label="Table of contents">
      <h2>Contents</h2>
      {items.length ? (
        <nav>
          {visibleItems.map((item) => {
            const expandable = hasChildren(item.id);
            const collapsed = isCollapsed(item.id);

            return (
              <div key={item.id} className="toc-row">
                {expandable ? (
                  <button
                    type="button"
                    className="toc-toggle"
                    aria-expanded={!collapsed}
                    aria-label={`${collapsed ? 'Expand' : 'Collapse'} ${item.text}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    {collapsed ? <Icons.ChevronRight size={18}/>: <Icons.ChevronDown size={18}/>}
                  </button>
                ) : (
                  <span className="toc-spacer" aria-hidden="true" />
                )}
                <button
                  type="button"
                  className={`toc-item toc-level-${item.level}`}
                  onClick={() =>
                    scrollRoot
                      ?.querySelector(`#${CSS.escape(item.id)}`)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                >
                  {item.text}
                </button>
              </div>
            );
          })}
        </nav>
      ) : (
        <p className="empty-text">Open a markdown file to build the TOC.</p>
      )}
    </aside>
  );
}
