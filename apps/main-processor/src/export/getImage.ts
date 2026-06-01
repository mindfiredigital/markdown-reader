import { extname } from 'node:path';

export function getImage(filePath: string): string {
  const ext = extname(filePath).slice(1).toLowerCase();
  if (ext === 'svg') return 'image/svg+xml';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';

  return 'application/octet-stream';
}
