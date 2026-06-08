import '@testing-library/jest-dom';
import { vi } from 'vitest';

// mock svg measurments for jsdom environment for mermaid testing
if (typeof window !== 'undefined' && window.SVGElement) {
  const proto = window.SVGElement.prototype as any;

  if (!proto.getBBox) {
    proto.getBBox = () => ({
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      top: 0,
      right: 100,
      bottom: 50,
      left: 0,
    });
  }
  if (!proto.getComputedTextLength) {
    proto.getComputedTextLength = () => 100;
  }
}

let mockSettings = {
  fontSize: 16,
  readingWidth: 'default',
  customCss: '',
};

Object.defineProperty(window, 'api', {
  value: {
    getSettings: vi.fn(async () => mockSettings),
    saveSettings: vi.fn(async (partial) => {
      mockSettings = { ...mockSettings, ...partial };
      return mockSettings;
    }),
  },
  writable: true,
});
