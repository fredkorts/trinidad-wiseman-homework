import { describe, it, expect } from 'vitest';
import { sortRows, nextDir } from '@/utils/sort';

describe('sorting', () => {
  const rows = [
    { id: 2, name: 'B', value: 20, category: 'x' },
    { id: 1, name: 'A', value: 10, category: 'y' },
    { id: 3, name: 'C', value: 30, category: 'z' }
  ];

  it('cycles dir', () => {
    expect(nextDir('none')).toBe('asc');
    expect(nextDir('asc')).toBe('desc');
    expect(nextDir('desc')).toBe('none');
  });

  it('sorts asc/desc', () => {
    const asc = sortRows(rows, { key: 'id', dir: 'asc' });
    expect(asc.map(r=>r.id)).toEqual([1,2,3]);
    const desc = sortRows(rows, { key: 'id', dir: 'desc' });
    expect(desc.map(r=>r.id)).toEqual([3,2,1]);
  });
});
