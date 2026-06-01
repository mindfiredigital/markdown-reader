import { TOCType } from '../../types/component-types';

// sets item level wise
export function getItemClasses(item: TOCType, activeId: string): string {
  let baseStyle =
    'toc-item flex h-8 items-center truncate pr-3 text-left text-sm transition-colors';
  if (item.level === 1) {
    baseStyle += ' pl-1 font-semibold';
  }
  if (item.level === 2) {
    baseStyle += ' pl-4';
  }
  if (item.level === 3) {
    baseStyle += ' pl-7 text-xs';
  }
  if (item.id === activeId) {
    baseStyle += ' font-medium';
  }
  return baseStyle;
}
