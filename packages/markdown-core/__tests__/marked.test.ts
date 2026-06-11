import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMarkdown } from '../src/config/marked';
import { heading } from '../src/utils/helper/heading-helper';

vi.mock('../src/utils/helper/heading-helper', () => ({
  escapeHtml: (str: string) => str,
  heading: vi.fn().mockImplementation((props, registry) => {
    const count = registry.get(props.text) || 0;
    return `<h${props.depth}>${props.text}-${count}</h${props.depth}>`;
  }),
}));

describe('get markdown instance and registry tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the  same instance on multiple calls', () => {
    const registry1 = new Map<string, number>();
    const registry2 = new Map<string, number>();
    const firstInstance = getMarkdown(registry1);
    const secondInstance = getMarkdown(registry2);
    expect(firstInstance).toBe(secondInstance);
  });

  it('should pass the correct registry data down to the heading renderer', async () => {
    const registry = new Map<string, number>([['Hello', 5]]);
    const instance = getMarkdown(registry);
    const result = await instance.parse('# Hello');
    expect(heading).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Hello', depth: 1 }),
      registry
    );
    expect(result).toContain('Hello-5');
  });

  it('should switch to a new registry map on a subsequent call', async () => {
    const firstRegistry = new Map<string, number>([['Title', 1]]);
    const secondRegistry = new Map<string, number>([['Title', 99]]);
    const instance1 = getMarkdown(firstRegistry);
    await instance1.parse('# Title');
    const instance2 = getMarkdown(secondRegistry);
    const result = await instance2.parse('# Title');
    expect(result).toContain('Title-99');
    expect(result).not.toContain('Title-1');
  });

  it('should handle an empty registry map without throwing error', async () => {
    const emptyRegistry = new Map<string, number>();
    const instance = getMarkdown(emptyRegistry);
    const parseAction = () => instance.parse('# Empty Test');
    await expect(parseAction()).resolves.not.toThrow();
  });
});
