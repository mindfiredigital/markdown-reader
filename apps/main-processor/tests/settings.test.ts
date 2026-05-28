import { describe, expect, it } from 'vitest';
import { validateSettings } from '../src/utils/helper/setting-helper';

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
});
