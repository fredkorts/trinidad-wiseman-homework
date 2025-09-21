export type SortDir = 'none' | 'asc' | 'desc';

export interface SortState<K extends PropertyKey = string> {
  key: K;
  dir: SortDir;
}

export function nextDir(dir: SortDir): SortDir {
  return dir === 'none' ? 'asc' : dir === 'asc' ? 'desc' : 'none';
}

/**
 * Generic sorter that works for any row shape without requiring an index signature.
 * We read values via a narrow `any` cast in the comparator.
 */
export function sortRows<T extends object>(
  rows: T[],
  state: SortState<keyof T> | null
): T[] {
  if (!state || state.dir === 'none') return rows;
  const { key, dir } = state;

  return [...rows].sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const av = (a as any)[key];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bv = (b as any)[key];

    if (av === bv) return 0;
    const cmp = av > bv ? 1 : -1;
    return dir === 'asc' ? cmp : -cmp;
  });
}
