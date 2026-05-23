/* eslint-disable no-empty */
import { describe, it, expect, afterAll } from 'vitest';
import { existsSync, unlinkSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { exportDOCX } from '../src/export/exportDocx';

const docxPath = join(tmpdir(), 'markdown-export.docx');
const invalidPath = join(tmpdir(), 'missing-folder-test', 'out.docx');

describe('export docx', () => {
  afterAll(() => {
    try {
      unlinkSync(docxPath);
    } catch {}
  });

  it('it should create a DOCX file at the specified output path', async () => {
    await exportDOCX(
      '<h1>Test DOCX</h1><p>Hello DOCX export.</p>',
      'body { color: black; }',
      docxPath
    );

    expect(existsSync(docxPath)).toBe(true);
  });

  it('it should create a non-empty DOCX file', () => {
    const stats = statSync(docxPath);

    expect(stats.size).toBeGreaterThan(100);
  });

  it('it should throw when output path is invalid', async () => {
    await expect(exportDOCX('<h1>Test</h1>', '', invalidPath)).rejects.toThrow();
  });

  it('it should handle empty HTML without crashing', async () => {
    await expect(exportDOCX('', 'body { color: black; }', docxPath)).resolves.not.toThrow();
  });
});
