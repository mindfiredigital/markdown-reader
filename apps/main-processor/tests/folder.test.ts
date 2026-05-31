import { describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { getFolder } from '../src/folder';

describe('folder reader testing', async () => {
  it('should enforce the recursion depth', async () => {
    const root = await mkdtemp(join(tmpdir(), 'markdown-reader-folder-'));
    let current = root;
    for (let index = 0; index < 12; index += 1) {
      current = join(current, `level-${index}`);
      await mkdir(current);
      await writeFile(join(current, `file-${index}.md`), '# test', 'utf-8');
    }

    const tree = await getFolder(root, 2);
    const first = tree.children?.find((child) => child.isDir);
    const second = first?.children?.find((child) => child.isDir);
    expect(second?.children).toEqual([]);
  });
});
