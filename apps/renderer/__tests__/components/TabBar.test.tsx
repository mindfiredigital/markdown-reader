import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TabBar } from '../../src/components/TabBar';
import { Tab } from '../../src/types/component-types';

const tabs: Tab[] = [
  {
    id: 'tab-1',
    filePath: '/README.md',
    fileName: 'README.md',
    html: '',
    scrollTop: 0,
    fontSize: 16,
  },
  {
    id: 'tab-2',
    filePath: '/CHANGELOG.md',
    fileName: 'CHANGELOG.md',
    html: '',
    scrollTop: 0,
    fontSize: 16,
  },
];

describe('TabBar', () => {
  it('renders all opened tabs', () => {
    render(<TabBar tabs={tabs} activeTabId="tab-1" onSwitch={() => {}} onClose={() => {}} />);
    expect(screen.getByText('README.md')).toBeInTheDocument();
    expect(screen.getByText('CHANGELOG.md')).toBeInTheDocument();
  });

  it('marks the active tab', () => {
    render(<TabBar tabs={tabs} activeTabId="tab-1" onSwitch={() => {}} onClose={() => {}} />);
    expect(screen.getByRole('tab', { name: /README/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('switches tab when a tab is clicked', async () => {
    const onSwitch = vi.fn();
    const user = userEvent.setup();

    render(<TabBar tabs={tabs} activeTabId="tab-1" onSwitch={onSwitch} onClose={() => {}} />);

    await user.click(screen.getByRole('tab', { name: /CHANGELOG/i }));

    expect(onSwitch).toHaveBeenCalledWith('tab-2');
  });

  it('closes a tab when close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(<TabBar tabs={tabs} activeTabId="tab-1" onSwitch={() => {}} onClose={onClose} />);

    await user.click(screen.getAllByRole('button', { name: /close .* tab/i })[0]);

    expect(onClose).toHaveBeenCalledWith('tab-1');
  });

  it('renders nothing when there are no tabs', () => {
    const { container } = render(
      <TabBar tabs={[]} activeTabId={null} onSwitch={() => {}} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });
});
