import { renderHook, act } from '@testing-library/react';
import { useCopyHandlers } from '../../src/hooks/useCopyHandlers';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('use Copy Handlers test', () => {
  let writeMock: ReturnType<typeof vi.fn>;
  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeMock = vi.fn();
    writeTextMock = vi.fn();

    Object.assign(navigator, {
      clipboard: {
        write: writeMock,
        writeText: writeTextMock,
      },
    });

    global.ClipboardItem = class {
      constructor(data: any) {}
    } as any;
  });

  it('should copy As Markdown copies markdown to clipboard using ClipboardItem', async () => {
    const { result } = renderHook(() => useCopyHandlers());
    let success = false;
    await act(async () => {
      success = await result.current.copyAsMarkdown('**test**');
    });
    expect(writeMock).toHaveBeenCalled();
    expect(success).toBe(true);
  });

  it('should copy As PlainText copies plain text to clipboard using ClipboardItem', async () => {
    const { result } = renderHook(() => useCopyHandlers());
    let success = false;
    await act(async () => {
      success = await result.current.copyAsPlainText('<p>test</p>');
    });
    expect(writeMock).toHaveBeenCalled();
    expect(success).toBe(true);
  });

  it('should fall back to writeText if ClipboardItem is not available', async () => {
    const originalClipboardItem = global.ClipboardItem;
    delete global.ClipboardItem;

    const { result } = renderHook(() => useCopyHandlers());
    let success = false;
    await act(async () => {
      success = await result.current.copyAsMarkdown('**fallback**');
    });

    expect(writeMock).not.toHaveBeenCalled();
    expect(writeTextMock).toHaveBeenCalledWith('**fallback**');
    expect(success).toBe(true);
    global.ClipboardItem = originalClipboardItem;
  });

  it('should short-circuit and return false for empty or undefined input', async () => {
    const { result } = renderHook(() => useCopyHandlers());
    let success = true;
    await act(async () => {
      success = await result.current.copyAsMarkdown(undefined);
    });

    expect(writeMock).not.toHaveBeenCalled();
    expect(writeTextMock).not.toHaveBeenCalled();
    expect(success).toBe(false);
  });

  it('should return false if clipboard write is rejected', async () => {
    writeMock.mockRejectedValueOnce(new Error('Rejected'));
    const { result } = renderHook(() => useCopyHandlers());

    let success = true;
    await act(async () => {
      success = await result.current.copyAsMarkdown('**test**');
    });

    expect(writeMock).toHaveBeenCalled();
    expect(success).toBe(false);
  });

  it('should extract plain text correctly from HTML', async () => {
    const originalClipboardItem = global.ClipboardItem;
    delete global.ClipboardItem;

    const { result } = renderHook(() => useCopyHandlers());
    await act(async () => {
      await result.current.copyAsPlainText('<div><h1>Title</h1><p>Paragraph</p></div>');
    });
    expect(writeTextMock).toHaveBeenCalledWith('TitleParagraph');
    global.ClipboardItem = originalClipboardItem;
  });
});
