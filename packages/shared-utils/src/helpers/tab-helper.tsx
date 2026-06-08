 import { Tab } from "@package/shared-types";
import { FILE_PATH } from "@package/shared-constants";

export function createTab(filePath: string, html = '',toc: Tab['toc']=[]): Tab {
  return {
    id: crypto.randomUUID(),
    filePath,
    fileName: filePath.split(FILE_PATH).pop() ?? 'Untitled',
    html,
    toc,
    scrollTop: 0,
    fontSize: 16,
  };
}