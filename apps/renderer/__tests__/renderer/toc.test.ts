import { describe, it, expect } from 'vitest';
import { extractTOC } from '../../src/renderer/toc';

describe('extract table of contents', () => {
  //test 1: checks empty array return from no heading
  it('returns empty array for HTML with no headings', () => {
    const markdown = 'My name is Ashminita';
    const toc = extractTOC(markdown);
    expect(toc).toEqual([]);
  });

  // test 2:- checks single heading extraction
  it('extracts a single H1 headings', () => {
    const markdown = '# Introduction\n\ntext';
    const toc = extractTOC(markdown);
    expect(toc).toHaveLength(1);
    expect(toc[0]).toEqual({ id: 'introduction', text: 'Introduction', level: 1 });
  });

  //test 3:-headings without id generate a slug from the text
  it('generates a id when heading has no id attribute', () => {
    const html = '## Getting Started';
    const toc = extractTOC(html);
    expect(toc[0]?.id).toBe('getting-started');
  });

  //test 4:- checks duplicate id
  it('generates unique ids for duplicate headings', () => {
    const markdown = `## Duplicate
  ## Duplicate`;
    const toc = extractTOC(markdown);
    expect(toc[0].id).toBe('duplicate');
    expect(toc[1].id).toBe('duplicate-1');
  });

  //test 5:-checks inline formating
  it('handles headings with inline HTML formating', () => {
    const markdown = `## <em>Hello</em> World`;
    const toc = extractTOC(markdown);
    expect(toc[0].text).toBe('Hello World');
    expect(toc[0].id).toBe('hello-world');
  });

  //test 6:- checks code spans
  it('handle headings with code spans', () => {
    const markdown = '## Install `npm`';
    const toc = extractTOC(markdown);
    expect(toc[0].text).toBe('Install npm');
  });

  it('does not extract headings from fenced code blocks', () => {
    const markdown = `# Real Heading

\`\`\`python
# Not a heading
## Also not a heading
\`\`\``;
    const toc = extractTOC(markdown);
    expect(toc).toEqual([{ id: 'real-heading', text: 'Real Heading', level: 1 }]);
  });

  it('handles headings with links', () => {
    const toc = extractTOC('## Read [the docs](https://example.com)');
    expect(toc[0]).toEqual({ id: 'read-the-docs', text: 'Read the docs', level: 2 });
  });
});
