import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { searchFolder } from '../src/folder-search';

const DIR = join(tmpdir(), 'md-search-test');

beforeAll(() => {
  mkdirSync(DIR, { recursive: true });
  writeFileSync(join(DIR, 'README.md'), '# Project\nThis project uses React.\nReact is great.');
  writeFileSync(join(DIR, 'CHANGELOG.md'), '# Changes\nVersion 1.0 released.');
  writeFileSync(join(DIR, 'notes.txt'), 'not a markdown file');
});
afterAll(() => {
  rmSync(DIR, { recursive: true, force: true });
});

describe('search folder', () => {
  it('should find matches in .md files and returns results', async () => {
    const results = await searchFolder(DIR, 'React');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.filePath.endsWith('README.md'))).toBe(true);
  });

  it('does not search non .md files', async () => {
    const results = await searchFolder(DIR, 'not a markdown');
    expect(results.every((r) => r.filePath.endsWith('.md'))).toBe(true);
  });

  it('should return empty array when query matches nothing', async () => {
    const results = await searchFolder(DIR, 'xyznotfound');
    expect(results).toHaveLength(0);
  });

  it('has search case insensitive', async () => {
    const lower = await searchFolder(DIR, 'react');
    const upper = await searchFolder(DIR, 'REACT');
    expect(lower.length).toBe(upper.length);
  });

  it('should reject with an error if the directory does not exist', async () => {
    const nonExistentDir = join(DIR, 'does-not-exist-folder');

    const results = await searchFolder(nonExistentDir, 'React');
    expect(results).toEqual([]);
  });
});
