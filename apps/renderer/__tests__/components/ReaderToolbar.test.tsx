import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReaderToolbar } from '../../src/components/ReaderToolbar';

describe('ReaderToolbar', () => {
  const defaultProps = {
    fontSize: 16,
    theme: 'dracula',
    onZoomIn: vi.fn(),
    onZoomOut: vi.fn(),
    onZoomReset: vi.fn(),
    onToggleTheme: vi.fn(),
  };

  it('should render vertically with flex-col', () => {
    render(<ReaderToolbar {...defaultProps} />);
    const toolbar = screen.getByRole('toolbar');
    expect(toolbar.className).toContain('flex-col');
  });

  it('should call onToggleRawText when raw text toggle is clicked', async () => {
    const handleToggleRaw = vi.fn();
    const user = userEvent.setup();
    render(<ReaderToolbar {...defaultProps} onToggleRawText={handleToggleRaw} viewMode="rendered" />);
    const toggleBtn = screen.getByRole('button', { name: /Show raw text/i });
    await user.click(toggleBtn);
    expect(handleToggleRaw).toHaveBeenCalledTimes(1);
  });
});
