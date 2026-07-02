import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarkmapViewer } from '../../src/components/MarkmapViewer';

// mocked the dynamic imports of markmap libraries
const mockTransform = vi.fn().mockReturnValue({ root: {} });
const mockSetData = vi.fn();
const mockFit = vi.fn();
const mockCreate = vi.fn().mockReturnValue({
  setData: mockSetData,
  fit: mockFit,
  destroy: vi.fn(),
});

vi.mock('markmap-lib', () => ({
  Transformer: vi.fn().mockImplementation(function() {
    return {
      transform: mockTransform,
    };
  }),
}));

vi.mock('markmap-view', () => ({
  Markmap: {
    create: mockCreate,
  },
}));

describe('Markmap viwer component tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should render an SVG container for the markmap', async () => {
    const {container}=render(<MarkmapViewer markdown="# Hello"/>);
    const svgElement=container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    await waitFor(() => {
      expect(mockTransform).toHaveBeenCalledWith('# Hello');
      expect(mockCreate).toHaveBeenCalled();
      expect(mockSetData).toHaveBeenCalled();
      expect(mockFit).toHaveBeenCalled();
    });
  });
  
  it('should not crash when markdown is undefined', async () => {
    const { container } = render(<MarkmapViewer markdown={undefined} />);
    expect(container).toHaveTextContent('No content to display in Mind Map');
    await new Promise((r) => setTimeout(r, 0));
    expect(mockTransform).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
