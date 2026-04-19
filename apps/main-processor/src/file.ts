import { readFile as fsReadFile } from 'node:fs/promises';

//file read logic
export async function readFile(filePath: string): Promise<string> {
  try {
    const content = await fsReadFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(`Could not read file: ${filePath}`, { cause: error });
  }
}
