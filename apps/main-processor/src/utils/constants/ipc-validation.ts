import path from 'path';
import { IpcMainInvokeEvent } from 'electron';

// production and dev urls
export const ALLOWED_MARKDOWN_EXTENSIONS = new Set(['.md', '.markdown']);
export const allowedFolderRoots = new Set<string>();
export const allowedMarkdownFiles = new Set<string>();

//validate the sender
export function validateSender(event: IpcMainInvokeEvent): boolean {
  const url = event.senderFrame?.url;

  if (!url) return false;

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.protocol === 'file:') {
      return true;
    }

    return parsedUrl.protocol === 'http:' && parsedUrl.hostname === 'localhost';
  } catch {
    return false;
  }
}

//validate path type
export function validatePath(filePath: string) {
  if (typeof filePath !== 'string' || filePath.trim().length === 0) {
    return false;
  }

  try {
    const resolvedPath = path.resolve(filePath);
    if (!path.isAbsolute(resolvedPath)) {
      return false;
    }
    // Prevent access to sensitive OS system folders
    const lower = resolvedPath.toLowerCase();
    if (process.platform === 'win32') {
      const sysDrive = (process.env.SystemDrive ?? 'C:').toLowerCase();
      const forbiddenPrefixes = [
        `${sysDrive}\\windows\\`,
        `${sysDrive}\\winnt\\`,
        `${sysDrive}\\boot\\`,
        `${sysDrive}\\system volume information\\`,
        `${sysDrive}\\$recycle.bin\\`,
      ];
      if (forbiddenPrefixes.some((p) => lower === p.slice(0, -1) || lower.startsWith(p))) {
        return false;
      }
    } else {
      const forbiddenPrefixes = [
        '/etc/',
        '/var/',
        '/sys/',
        '/proc/',
        '/boot/',
        '/bin/',
        '/sbin/',
        '/dev/',
      ];
      if (forbiddenPrefixes.some((p) => lower === p.slice(0, -1) || lower.startsWith(p))) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

export function isPathInside(childPath: string, parentPath: string): boolean {
  const relative = path.relative(parentPath, childPath);
  return (
    relative === '' || (!!relative && !relative.startsWith('..') && !path.isAbsolute(relative))
  );
}
