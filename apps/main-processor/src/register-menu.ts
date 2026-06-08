import { Menu } from 'electron';
import { buildMenuTemplate } from './menu';

export function registerMenu(currentTheme: string): void {
  const menu = Menu.buildFromTemplate(buildMenuTemplate(currentTheme));
  Menu.setApplicationMenu(menu);
}
