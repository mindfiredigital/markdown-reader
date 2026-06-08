import { describe, expect, it } from 'vitest';
import { validateSettings } from '../src/utils/helper/setting-helper';
import { READING_WIDTHS } from '../src/utils/constants/setting-constants';
import { THEMES } from '@package/shared-constants';
describe('settings validation', () => {
  it('accepts valid settings', () => {
    expect(validateSettings({ fontSize: 18 })).toEqual({ fontSize: 18 });
  });

  it('rejects unknown keys', () => {
    expect(() => validateSettings({ unexpected: true } as never)).toThrow('Unknown settings key');
  });

  it('rejects invalid values', () => {
    expect(() => validateSettings({ fontSize: 100 })).toThrow('Invalid fontSize');
  });

  it('validates theme values', () => {
    expect(validateSettings({ theme: THEMES[0] })).toEqual({ theme: THEMES[0] });
    expect(() => validateSettings({ theme: 'unknown-theme' as never })).toThrow('Invalid theme');
  });

  it('validates readingWidth values', () => {
    expect(READING_WIDTHS.has('default')).toBe(true);
    expect(validateSettings({ readingWidth: 'default' })).toEqual({ readingWidth: 'default' });
    expect(() => validateSettings({ readingWidth: 'full' as never })).toThrow(
      'Invalid readingWidth'
    );
  });

  it('validates boolean settings', () => {
    expect(validateSettings({ lineNumbers: true })).toEqual({ lineNumbers: true });
    expect(validateSettings({ showHiddenFiles: false })).toEqual({ showHiddenFiles: false });
    expect(() => validateSettings({ lineNumbers: 'yes' as never })).toThrow('Invalid lineNumbers');
    expect(() => validateSettings({ showHiddenFiles: 'no' as never })).toThrow(
      'Invalid showHiddenFiles'
    );
  });

  it('validates customCss values', () => {
    expect(validateSettings({ customCss: '.markdown-body { color: red; }' })).toEqual({
      customCss: '.markdown-body { color: red; }',
    });
    expect(() => validateSettings({ customCss: 42 as never })).toThrow('Invalid customCss');
    expect(() => validateSettings({ customCss: 'a'.repeat(10001) })).toThrow('Invalid customCss');
  });

  it('validates zoom range', () => {
    expect(validateSettings({ zoom: 50 })).toEqual({ zoom: 50 });
    expect(validateSettings({ zoom: 200 })).toEqual({ zoom: 200 });
    expect(() => validateSettings({ zoom: 49 })).toThrow('Invalid zoom');
    expect(() => validateSettings({ zoom: 201 })).toThrow('Invalid zoom');
  });

  it('validates recentFilesLimit range', () => {
    expect(validateSettings({ recentFilesLimit: 1 })).toEqual({ recentFilesLimit: 1 });
    expect(validateSettings({ recentFilesLimit: 50 })).toEqual({ recentFilesLimit: 50 });
    expect(() => validateSettings({ recentFilesLimit: 0 })).toThrow('Invalid recentFilesLimit');
    expect(() => validateSettings({ recentFilesLimit: 51 })).toThrow('Invalid recentFilesLimit');
  });
});
