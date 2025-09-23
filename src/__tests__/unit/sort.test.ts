import { describe, it, expect } from 'vitest';
import { sortRows, nextDir } from '@/utils/sort';

describe('sort helpers', () => {
  const rows = [
    { id: 2, name: 'B', value: 20, category: 'x' },
    { id: 1, name: 'A', value: 10, category: 'y' },
    { id: 3, name: 'C', value: 30, category: 'z' },
  ] as const;

  it('cycles through the available sort directions', () => {
    expect(nextDir('none')).toBe('asc');
    expect(nextDir('asc')).toBe('desc');
    expect(nextDir('desc')).toBe('none');
  });

  it('returns the original array when sorting is disabled', () => {
    expect(sortRows(rows, null)).toBe(rows);
    expect(sortRows(rows, { key: 'id', dir: 'none' })).toBe(rows);
  });

  it('sorts rows without mutating the original array', () => {
    const asc = sortRows(rows, { key: 'id', dir: 'asc' });
    const desc = sortRows(rows, { key: 'name', dir: 'desc' });

    expect(asc).not.toBe(rows);
    expect(desc).not.toBe(rows);

    expect(asc.map((row) => row.id)).toEqual([1, 2, 3]);
    expect(desc.map((row) => row.name)).toEqual(['C', 'B', 'A']);

    // Ensure equal values remain stable.
    const withDuplicates = [
      { id: 1, name: 'A', value: 10 },
      { id: 2, name: 'B', value: 10 },
      { id: 3, name: 'C', value: 20 },
    ];

    const sorted = sortRows(withDuplicates, { key: 'value', dir: 'asc' });
    expect(sorted.map((row) => row.id)).toEqual([1, 2, 3]);
  });
});
