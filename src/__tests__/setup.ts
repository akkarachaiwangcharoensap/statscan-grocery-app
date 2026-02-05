import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Polyfill window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Provide a jest compatibility alias for existing tests that use jest.*
// This allows tests to continue using jest.fn / jest.clearAllMocks etc.
// Prefer updating tests to use vi.* in the future.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).jest = vi as any;