import { OpenedMarkdownDocument } from '../types';

export async function readMarkdownFile(file: File): Promise<OpenedMarkdownDocument> {
  return {
    id: `${file.name}-${file.lastModified}`,
    name: file.name,
    markdown: await file.text(),
  };
}
