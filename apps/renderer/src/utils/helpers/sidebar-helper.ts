import { TOCType } from '../../types/component-types';

// sets item level wise
export function getItemClasses(item: TOCType, activeId: string): string {
  let baseStyle =
    'toc-item flex min-h-8 py-1.5 items-center pr-3 text-left text-sm transition-all duration-150 rounded-md';
  if (item.level === 1) {
    baseStyle += ' pl-2 font-semibold text-text-base';
  } else if (item.level === 2) {
    baseStyle += ' pl-5 text-text-muted';
  } else {
    baseStyle += ' pl-8 text-xs text-text-muted';
  }
  if (item.id === activeId) {
    baseStyle += ' font-semibold text-accent bg-accent-bg';
  }
  return baseStyle;
}
