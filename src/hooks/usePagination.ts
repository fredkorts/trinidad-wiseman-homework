// usePagination slices an array into pages, exposing helpers for navigation,
// page size adjustments, and range metadata derived from the current state.
import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], initialPerPage = 10) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(initialPerPage);

  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const end = Math.min(total, start + perPage);

  const data = useMemo(() => items.slice(start, end), [items, start, end]);

  const setPageSafe = (p: number) => setPage(Math.min(Math.max(1, p), pages));

  return { page, pages, perPage, setPerPage, setPage: setPageSafe, range: [start + 1, end] as const, total, data };
}
