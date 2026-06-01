import { MENU_EVENT_LIST } from '@package/shared-constants';

export type MenuEventName = (typeof MENU_EVENT_LIST)[number];

export function isMenuEvent(event: string): event is MenuEventName {
  return MENU_EVENT_LIST.includes(event as MenuEventName);
}
