import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MarkmapViewer } from '../../src/components/MarkmapViewer';

// mocked the dynamic imports of markmap libraries
vi.mock('markmap-lib', () => ({
  Transformer: vi.fn().mockImplementation(() => ({
    transform: vi.fn().mockReturnValue({ root: {} }),
  })),
}));

vi.mock('markmap-view', () => ({
  Markmap: {
    create: vi.fn().mockReturnValue({
      setData: vi.fn(),
      fit: vi.fn(),
    }),
  },
}));

describe('Markmap viwer component tests',()=>{
    it('should render an SVG container for the markmap',()=>{
        const {container}=render(<MarkmapViewer markdown="# Hello"/>);
        const svgElement=container.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
    });

    it('should not crash when markdown is undefined',()=>{
        const {container} =render(<MarkmapViewer markdown={undefined}/>);
        const svgElement=container.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
    })
})
