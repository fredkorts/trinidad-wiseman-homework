import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePagination } from '@/hooks/usePagination';

describe('usePagination', () => {
  const items = Array.from({ length: 12 }, (_, i) => `item-${i + 1}`);

  it('derives total pages, range, and sliced data', () => {
    const { result } = renderHook(() => usePagination(items, 5));

    expect(result.current.page).toBe(1);
    expect(result.current.pages).toBe(3);
    expect(result.current.total).toBe(items.length);
    expect(result.current.range).toEqual([1, 5]);
    expect(result.current.data).toEqual(items.slice(0, 5));
  });

  it('clamps page updates within bounds', () => {
    const { result } = renderHook(() => usePagination(items, 5));

    act(() => result.current.setPage(0));
    expect(result.current.page).toBe(1);

    act(() => result.current.setPage(10));
    expect(result.current.page).toBe(result.current.pages);

    act(() => result.current.setPage(2));
    expect(result.current.page).toBe(2);
    expect(result.current.range).toEqual([6, 10]);
    expect(result.current.data).toEqual(items.slice(5, 10));
  });

  it('recomputes pagination when page size changes', () => {
    const { result } = renderHook(() => usePagination(items, 4));

    act(() => result.current.setPerPage(3));
    expect(result.current.perPage).toBe(3);
    expect(result.current.pages).toBe(4);
    expect(result.current.range).toEqual([1, 3]);
    expect(result.current.data).toEqual(items.slice(0, 3));

    act(() => result.current.setPage(4));
    expect(result.current.range).toEqual([10, 12]);
    expect(result.current.data).toEqual(items.slice(9, 12));
  });
});
