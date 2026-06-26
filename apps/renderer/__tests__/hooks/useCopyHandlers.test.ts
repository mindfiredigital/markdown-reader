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

  it('should copy As Markdown copies markdown to clipboard', async () => {
    const { result } = renderHook(() => useCopyHandlers());
    await act(async () => {
      await result.current.copyAsMarkdown('**test**');
    });
    expect(writeMock).toHaveBeenCalled();
  });

  it('should copy As PlainText copies plain text to clipboard', async () => {
    const { result } = renderHook(() => useCopyHandlers());
    await act(async () => {
      await result.current.copyAsPlainText('<p>test</p>');
    });
    expect(writeMock).toHaveBeenCalled();
  });
});
