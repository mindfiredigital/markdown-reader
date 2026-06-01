import path from 'path';
import { realpath, stat } from 'node:fs/promises';
import {
  validatePath,
  isPathInside,
  ALLOWED_MARKDOWN_EXTENSIONS,
  allowedFolderRoots,
} from '../constants/ipc-validation';

/* Validates, resolves symlink and ensures a path is a valid Markdown file inside an optional root directory */
export async function resolveMarkdownFilePath(
  filePath: string,
  allowedRoot?: string
): Promise<string> {
  if (!validatePath(filePath)) {
    throw new Error('Invalid file path');
  }
  const realFilePath = await realpath(path.resolve(filePath));
  if (!validatePath(realFilePath)) {
    throw new Error('Invalid file path');
  }
  const fileStats = await stat(realFilePath);
  if (!fileStats.isFile()) {
    throw new Error('Path is not a file');
  }
  const ext = path.extname(realFilePath).toLowerCase();
  if (!ALLOWED_MARKDOWN_EXTENSIONS.has(ext)) {
    throw new Error(`Disallowed file extension: ${ext}`);
  }
  if (allowedRoot) {
    const realAllowedRoot = await realpath(path.resolve(allowedRoot));
    if (!isPathInside(realFilePath, realAllowedRoot)) {
      throw new Error('Path escapes allowed directory');
    }
  }
  return realFilePath;
}

/*Validates, resolves symlinks and ensures a path points to an existing directory.*/
export async function resolveDirectoryPath(folderPath: string): Promise<string> {
  if (!validatePath(folderPath)) {
    throw new Error('Invalid folder path');
  }
  const realFolderPath = await realpath(path.resolve(folderPath));
  if (!validatePath(realFolderPath)) {
    throw new Error('Invalid folder path');
  }
  const folderStats = await stat(realFolderPath);
  if (!folderStats.isDirectory()) {
    throw new Error('Path is not a directory');
  }
  return realFolderPath;
}

/*Resolves a Markdown file path against a dynamic set of allowed root folders throwing an error if it matches none*/
export async function resolveWatchedMarkdownPath(filePath: string): Promise<string> {
  let lastError: unknown;
  for (const allowedRoot of allowedFolderRoots) {
    try {
      return await resolveMarkdownFilePath(filePath, allowedRoot);
    } catch (error) {
      lastError = error;
    }
  }
  if (allowedFolderRoots.size > 0) {
    throw lastError instanceof Error ? lastError : new Error('Path escapes allowed directory');
  }
  return await resolveMarkdownFilePath(filePath);
}
