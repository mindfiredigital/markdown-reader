import { ElectronFile } from '../types/component-types';

export function extractDroppedMdpath(dt: DataTransfer): string | null {
  if (!dt.files || dt.files.length === 0) return null;
  const files = Array.from(dt.files) as ElectronFile[];
  for (const f of files) {
    if (f && f.path && /\.m(?:d|arkdown)$/i.test(f.name)) {
      return f.path;
    }
  }
  return null;
}
