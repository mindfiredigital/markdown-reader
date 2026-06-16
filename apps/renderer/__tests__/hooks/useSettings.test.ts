import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSettings } from '../../src/hooks/useSettings';
import { createMockPlatform, createPlatformWrapper } from '../test-utils';

function renderUseSettings(platform = createMockPlatform()) {
  return renderHook(() => useSettings(), {
    wrapper: createPlatformWrapper(platform),
  });
}

describe('useSettings font size', () => {
  it('should initialize with font size 16', async () => {
    const { result } = renderUseSettings();
    await waitFor(() => {
      expect(result.current.fontSize).toBe(16);
    });
  });

  it('should increase font size by adding 2px', async () => {
    const { result } = renderUseSettings();
    await act(async () => {
      await result.current.increaseFontSize();
    });
    expect(result.current.fontSize).toBe(18);
  });

  it('should decrease font size by subtracting 2px', async () => {
    const { result } = renderUseSettings();
    await act(async () => {
      await result.current.decreaseFontSize();
    });
    expect(result.current.fontSize).toBe(14);
  });

  it('should not exceed 24px', async () => {
    const { result } = renderUseSettings();

    for (let i = 0; i < 10; i += 1) {
      await act(async () => {
        await result.current.increaseFontSize();
      });
    }

    expect(result.current.fontSize).toBe(24);
  });

  it('should reset font size to 16', async () => {
    const { result } = renderUseSettings();

    await act(async () => {
      await result.current.increaseFontSize();
    });

    await act(async () => {
      await result.current.resetFontSize();
    });

    expect(result.current.fontSize).toBe(16);
  });
});
