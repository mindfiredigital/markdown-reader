 import { Tab } from "../../types/component-types";
import { FILE_PATH } from "../constants/regex-constants";

export function createTab(filePath: string, html = '', toc: Tab['toc'] = [], markdown = ''): Tab {
  return {
    id: crypto.randomUUID(),
    filePath,
    fileName: filePath.split(FILE_PATH).pop() ?? 'Untitled',
    html,
    markdown,
    toc,
    scrollTop: 0,
    fontSize: 16,
  };
}