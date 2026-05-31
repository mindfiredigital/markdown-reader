import DOMPurify from 'dompurify';
import { describe, expect, it } from 'vitest';
import { renderMarkdown } from '../../src/renderer/markdown';

describe('DOM Purify sanitization ', () => {
  it('it should remove iframe tags from rendered markdown html', async () => {
    const dirtyHtml = await renderMarkdown(`<iframe src="https://example.com"></iframe>`);
    const safeHtml = DOMPurify.sanitize(dirtyHtml);
    expect(safeHtml).not.toContain('<iframe');
    expect(safeHtml).not.toContain('</iframe>');
  });

  it('should remove script tags from rendered markdown html', async () => {
    const dirtyHtml = await renderMarkdown(`<script>alert("xss")</script>`);
    const safeHtml = DOMPurify.sanitize(dirtyHtml);
    expect(safeHtml).not.toContain('<script');
    expect(safeHtml).not.toContain('</script>');
    expect(safeHtml).not.toContain('alert("xss")');
  });

  it('should remove dangerous inline event handlers from image tags', async () => {
    const dirtyHtml = await renderMarkdown(`<img src="x" onerror="alert('xss')" />`);
    const safeHtml = DOMPurify.sanitize(dirtyHtml);
    expect(safeHtml).toContain('<img');
    expect(safeHtml).toContain('src="x"');
    expect(safeHtml).not.toContain('onerror');
    expect(safeHtml).not.toContain("alert('xss')");
  });

  it('should remove javascript urls from links', async () => {
    const dirtyHtml = await renderMarkdown(`<a href="javascript:alert('xss')">Click me</a>`);
    const safeHtml = DOMPurify.sanitize(dirtyHtml);
    expect(safeHtml).toContain('Click me');
    expect(safeHtml).not.toContain('javascript:');
    expect(safeHtml).not.toContain("alert('xss')");
  });

  it('should keep safe markdown content after sanitization', async () => {
    const dirtyHtml = await renderMarkdown(`
#  Heading
This is a **good** paragraph.
[GitHub](https://github.com)
<img src="image.png" alt="safe image" />
`);
    const safeHtml = DOMPurify.sanitize(dirtyHtml);
    expect(safeHtml).toContain('<h1');
    expect(safeHtml).toContain('Heading');
    expect(safeHtml).toContain('<strong>good</strong>');
    expect(safeHtml).toContain('href="https://github.com"');
    expect(safeHtml).toContain('alt="safe image"');
  });
});
