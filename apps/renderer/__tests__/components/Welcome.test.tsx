import { describe, it, expect, vi } from 'vitest';
import { render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Welcome } from '../../src/components/Welcome';
import { createMockPlatform, createPlatformWrapper } from '../test-utils';

describe('Welcome', () => {
  const wrapper = createPlatformWrapper();

  it('renders the app title in extension mode', () => {
    const chromeWrapper = createPlatformWrapper({
      ...createMockPlatform(),
      kind: 'chrome',
    });
    render(<Welcome onOpen={() => {}} recentFiles={[]} />, { wrapper: chromeWrapper });
    expect(screen.getByRole('heading', { name: /markdown reader/i })).toBeInTheDocument();
  });

  it('renders the Open File button', () => {
    render(<Welcome onOpen={() => {}} recentFiles={[]} />, { wrapper });
    expect(screen.getByRole('button', { name: /Open File/i })).toBeInTheDocument();
  });

  it('calls onOpen when the Open File button is clicked', async () => {
    const handleOpen = vi.fn();
    const user = userEvent.setup();
    render(<Welcome onOpen={handleOpen} recentFiles={[]} />, { wrapper });
    await user.click(screen.getByRole('button', { name: /Open File/i }));
    expect(handleOpen).toHaveBeenCalledTimes(1);
  });

  it('shows a list of recent files when provided', () => {
    const recent = [
      { path: '/docs/README.md', name: 'README.md', openedAt: Date.now() },
      { path: '/notes/todo.md',  name: 'todo.md',   openedAt: Date.now() },
    ];
    render(<Welcome onOpen={() => {}} recentFiles={recent} />, { wrapper });
    expect(screen.getByText('README.md')).toBeInTheDocument();
    expect(screen.getByText('todo.md')).toBeInTheDocument();
  });

});