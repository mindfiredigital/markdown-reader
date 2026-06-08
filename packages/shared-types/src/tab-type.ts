export interface TOCType {
  id: string;
  text: string;
  level: 1 | 2 | 3;
}
export interface Tab {
  id: string;
  filePath: string;
  fileName: string;
  html: string;
  toc?: TOCType[];
  scrollTop: number;
  fontSize: number;
}
