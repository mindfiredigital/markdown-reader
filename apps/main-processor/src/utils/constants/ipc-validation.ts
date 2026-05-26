import path from 'path';
import { IpcMainInvokeEvent } from 'electron';

// production and dev urls
const allowedOrigin = ['file://', 'http://localhost'];
export const ALLOWED_MARKDOWN_EXTENSIONS = new Set(['.md', '.markdown']);
export const allowedFolderRoots = new Set<string>();

//validate the sender
export function validateSender(event: IpcMainInvokeEvent): boolean {
  const url = event.senderFrame?.url || '';
  return allowedOrigin.some((origin) => url.startsWith(origin));
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
      const forbiddenPrefixes = [
        'c:\\windows\\',
        'c:\\winnt\\',
        'c:\\boot\\',
        'c:\\system volume information\\',
        'c:\\$recycle.bin\\',
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
