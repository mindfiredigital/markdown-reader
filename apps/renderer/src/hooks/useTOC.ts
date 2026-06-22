import { useEffect, useState } from 'react';
import { TOCType } from '../types/component-types';

export function useToc(tocItems: TOCType[]) {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    if (!tocItems.length) return;
    const mainElement = document.querySelector('main');
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          setActiveId(visible.target.id);
        }
      },
      {
        root: mainElement,
        rootMargin: '-5% 0px -75% 0px',
      }
    );
    tocItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  };

  return { activeId, scrollToHeading };
}
