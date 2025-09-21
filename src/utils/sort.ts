import type { Row } from '@/types';

export type SortDir = 'none' | 'asc' | 'desc';
export interface SortState { key: keyof Row; dir: SortDir; }

export function nextDir(dir: SortDir): SortDir {
  return dir === 'none' ? 'asc' : dir === 'asc' ? 'desc' : 'none';
}

export function sortRows(rows: Row[], state: SortState | null): Row[] {
  if (!state || state.dir === 'none') return rows;
  const { key, dir } = state;
  return [...rows].sort((a, b) => {
    const av = a[key]; const bv = b[key];
    if (av === bv) return 0;
    const cmp = av > bv ? 1 : -1;
    return dir === 'asc' ? cmp : -cmp;
  });
}
