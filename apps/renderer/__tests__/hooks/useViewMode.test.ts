import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useViewMode } from '../../src/hooks/useViewMode';

describe('use view mode hook test', () => {
  it('should initialize with rendered mode by default', () => {
    const { result } = renderHook(() => useViewMode());
    expect(result.current.viewMode).toBe('rendered');
  });

  it('should toggle between raw and rendered', () => {
    const { result } = renderHook(() => useViewMode());
    act(() => {
      result.current.toggleRawText();
    });
    expect(result.current.viewMode).toBe('raw');

    act(() => {
      result.current.toggleRawText();
    });
    expect(result.current.viewMode).toBe('rendered');
  });

  it('should toggle between mindmap and redered content', () => {
    const { result } = renderHook(() => useViewMode());
    act(() => {
      result.current.toggleMindMap();
    });
    expect(result.current.viewMode).toBe('mindmap');

    act(() => {
      result.current.toggleMindMap();
    });
    expect(result.current.viewMode).toBe('rendered');
  });
});
