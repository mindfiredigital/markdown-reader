import { vi, describe, it, expect } from 'vitest';
import { RecentFile } from '@package/shared-types';
import { addToRecentList } from '../src/recent/addToRecentList';
import { getUniqueRecentFile } from '../src/recent/getUniqueRecentFile';
import { removeFromRecentList } from '../src/recent/removeFromRecentList';
import { stat } from 'node:fs/promises';

vi.mock('node:fs/promises', () => ({
  stat: vi.fn().mockRejectedValue(new Error('ENOENT')),
}));

const mk = (path: string): RecentFile => ({
  path,
  name: path.split('/').pop() ?? path,
  openedAt: Date.now(),
});

describe('recent list functions', () => {
  it('addToRecentList puts new file at the front', async () => {
    const r = await addToRecentList([mk('/b.md')], '/a.md');
    expect(r[0]?.path).toBe('/a.md');
  });

  it('addToRecentList moves existing file to front without duplicating', async () => {
    const r = await addToRecentList([mk('/a.md'), mk('/b.md')], '/b.md');
    expect(r[0]?.path).toBe('/b.md');
    expect(r).toHaveLength(2);
  });

  it('getUniqueRecetFiles list at 20 items', () => {
    const big = Array.from({ length: 25 }, (_, i) => mk(`/f${i}.md`));
    expect(getUniqueRecentFile(big)).toHaveLength(20);
  });

  it('getUniqueRecentFiles removes duplicate paths', () => {
    const r = getUniqueRecentFile([mk('/a.md'), mk('/b.md'), mk('/a.md')]);
    expect(r.filter((f) => f.path === '/a.md')).toHaveLength(1);
  });

  it('removeFromRecentList removes specified path', () => {
    const r = removeFromRecentList([mk('/a.md'), mk('/b.md')], '/a.md');
    expect(r.find((f) => f.path === '/a.md')).toBeUndefined();
  });

  it('addToRecentList on empty list creates a one-item list', async () => {
    const r = await addToRecentList([], '/first.md');
    expect(r).toHaveLength(1);
    expect(r[0]?.path).toBe('/first.md');
  });

  it('addToRecentList includes size property when stat succeeds', async () => {
    vi.mocked(stat).mockResolvedValueOnce({ size: 1024 } as any);
    const r = await addToRecentList([], '/success.md');
    expect(r[0]).toHaveProperty('size', 1024);
  });

  it('addToRecentList handles size enrichment when stat fails', async () => {
    const r = await addToRecentList([], '/failure.md');
    expect(r[0]?.path).toBe('/failure.md');
    expect(r[0]).not.toHaveProperty('size');
  });
});
