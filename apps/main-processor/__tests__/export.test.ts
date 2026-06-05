import { describe, it, expect } from 'vitest';
import { mkdtemp, writeFile, rm, realpath } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildDocument } from '../src/export/buildDocument';
import { sanitizeCss } from '../src/export/sanitizeCss';
import { getImage } from '../src/export/getImage';
import { inlineImages } from '../src/export/inlineImage';
import { allowedFolderRoots } from '../src/utils/constants/ipc-validation';

describe('build html document', () => {
  it('wraps content in a valid HTML5 document shell', () => {
    const html = buildDocument('<h1>Hello</h1>', '');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('<h1>Hello</h1>');
  });

  it('inlines the provided CSS inside a <style> tag', () => {
    const html = buildDocument('<p>text</p>', 'body { color: red; }');
    expect(html).toContain('<style>');
    expect(html).toContain('body { color: red; }');
  });

  it('sets UTF-8 charset in meta tag', () => {
    const html = buildDocument('', '');
    expect(html).toContain('charset="UTF-8"');
  });
});

describe('sanitise css for export ', () => {
  it('keeps safe css', () => {
    const css = sanitizeCss('body { color: red; font-size: 16px; }');

    expect(css).toContain('color: red');
    expect(css).toContain('font-size: 16px');
  });

  it('removes unsafe css patterns', () => {
    const css = sanitizeCss(
      'body { behavior: url(test.htc); background: url(javascript:alert(1)); } ' +
        '@import "http://example.com/style.css"; ' +
        '@import url("https://example.com/no-semicolon")' +
        'div { background: url(https://example.com/bg.png); } ' +
        'p { background: url(//example.com/bg.png); } ' +
        'span { background: url(http://example.com/bg.png); }'
    );

    expect(css).not.toContain('behavior');
    expect(css).not.toContain('javascript:');
    expect(css).not.toContain('@import');
    expect(css).not.toContain('https://');
    expect(css).not.toContain('http://');
    expect(css).not.toContain('//example.com');
  });
});

describe('get image of mime type', () => {
  it('returns correct mime type for common image extensions', () => {
    expect(getImage('image.png')).toBe('image/png');
    expect(getImage('image.jpg')).toBe('image/jpeg');
    expect(getImage('image.jpeg')).toBe('image/jpeg');
    expect(getImage('image.svg')).toBe('image/svg+xml');
    expect(getImage('image.webp')).toBe('image/webp');
  });
});

describe('inline images for HTML export', () => {
  it('keeps local images as base 64 data URIs', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'markdown-reader-export-'));
    const resolvedDir = await realpath(dir);
    allowedFolderRoots.add(resolvedDir);
    try {
      const imagePath = join(resolvedDir, 'image.png');
      await writeFile(imagePath, Buffer.from([137, 80, 78, 71]));
      const html = await inlineImages(`<img src="${imagePath}"/>`);
      expect(html).toContain('src="data:image/png;base64,');
    } finally {
      allowedFolderRoots.delete(resolvedDir);
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('does not inline images outside approved folders', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'markdown-reader-export-deny-'));
    try {
      const imagePath = join(dir, 'private.png');
      await writeFile(imagePath, Buffer.from([137, 80, 78, 71]));
      const html = await inlineImages(`<img src="${imagePath}"/>`);
      expect(html).toBe(`<img src="${imagePath}"/>`);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
