import { describe, it, expect } from 'vitest';
import { parseCallouts } from '../../src/renderer/callout';

describe('parse callouts', () => {
  it('converts [!NOTE] blockqoute to a styled div with callout notre class', () => {
    const html = '<blockquote><p>[!NOTE]\nThis is a note.</p></blockquote>';
    const result = parseCallouts(html);
    expect(parseCallouts(html)).toContain('📝');
    expect(result).toContain('callout-note');
    expect(result).toContain('This is a note');
  });

  it('converts [!WARNING] to callout-warning class', () => {
    const html = '<blockquote><p>[!WARNING]\nBe careful.</p></blockquote>';
    expect(parseCallouts(html)).toContain('⚠️');
    expect(parseCallouts(html)).toContain('callout-warning');
  });

  it('converts [!TIP] to callout-tip class', () => {
    const html = '<blockquote><p>[!TIP]\nextra tip here.</p></blockquote>';
    expect(parseCallouts(html)).toContain('💡');
    expect(parseCallouts(html)).toContain('callout-tip');
  });

  it('converts [!INFO] to callout-info class', () => {
    const html = '<blockquote><p>[!INFO]\nvery informative.</p></blockquote>';
    expect(parseCallouts(html)).toContain('ℹ️');
    expect(parseCallouts(html)).toContain('callout-info');
  });

  it('converts [!IMPORTANT] to callout-important class', () => {
    const html = '<blockquote><p>[!IMPORTANT]\nnews is important.</p></blockquote>';
    expect(parseCallouts(html)).toContain('🚨');
    expect(parseCallouts(html)).toContain('callout-important');
  });

  it('converts [!CAUTION] to callout-caution class', () => {
    const html = '<blockquote><p>[!CAUTION]\nvery cautious.</p></blockquote>';
    expect(parseCallouts(html)).toContain('🛑');
    expect(parseCallouts(html)).toContain('callout-caution');
  });

  it('leaves regular blockqoutes without a callout marker unchanged', () => {
    const html = '<blockquote><p>A regular qoute.</p></blockquote>';
    expect(parseCallouts(html)).toBe(html);
  });
});
