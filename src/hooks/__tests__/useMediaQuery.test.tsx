import { renderHook, act, waitFor } from '@testing-library/react';
import ReactDOMServer from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

const originalMatchMedia = window.matchMedia;
const originalWindow = globalThis.window;

afterEach(() => {
  globalThis.window = originalWindow;
  if (originalMatchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    });
  }
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('useMediaQuery', () => {
  it('returns false when rendering without a window (SSR)', async () => {
    globalThis.window = undefined as unknown as Window & typeof globalThis;

    const module = await import('../useMediaQuery');
    const { useMediaQuery } = module;

    function TestComponent() {
      const matches = useMediaQuery('(max-width: 600px)');
      return <span>{String(matches)}</span>;
    }

    const markup = ReactDOMServer.renderToString(<TestComponent />);
    expect(markup).toContain('false');
  });

  it('reacts to matchMedia changes and cleans up listeners', async () => {
    const module = await import('../useMediaQuery');
    const { useMediaQuery } = module;

    const listeners = new Set<(event: MediaQueryListEvent) => void>();
    const addEventListener = vi.fn(
      (_event: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener);
      },
    );
    const removeEventListener = vi.fn(
      (_event: string, listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener);
      },
    );

    const mql: MediaQueryList = {
      media: '(max-width: 600px)',
      matches: true,
      onchange: null,
      addEventListener,
      removeEventListener,
      addListener: addEventListener as unknown as MediaQueryList['addListener'],
      removeListener: removeEventListener as unknown as MediaQueryList['removeListener'],
      dispatchEvent: vi.fn(),
    };

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn(() => mql),
    });

    const { result, unmount } = renderHook(() => useMediaQuery('(max-width: 600px)'));

    await waitFor(() => expect(addEventListener).toHaveBeenCalledTimes(1));
    expect(result.current).toBe(true);

    const emitChange = (matches: boolean) => {
      mql.matches = matches;
      listeners.forEach((listener) => listener({ matches } as MediaQueryListEvent));
    };

    act(() => emitChange(false));
    expect(result.current).toBe(false);

    unmount();
    expect(removeEventListener).toHaveBeenCalledTimes(1);
  });
});
