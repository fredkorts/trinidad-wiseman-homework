import { useMemo, useState } from 'react';
import type { Row } from '@/types';
import { nextDir, sortRows, type SortDir, type SortState } from '@/utils/sort';
import { usePagination } from '@/hooks/usePagination';
import { Select, Button } from 'antd';

interface Props { rows: Row[]; }

function SortHeader({ label, active, dir }: { label: string; active: boolean; dir: SortDir; }) {
  const suffix = !active ? '' : dir === 'asc' ? ' ↑' : dir === 'desc' ? ' ↓' : '';
  return <span aria-live="polite">{label}{suffix}</span>;
}

export default function CustomTable({ rows }: Props) {
  const [sort, setSort] = useState<SortState | null>(null);

  const sorted = useMemo(() => sortRows(rows, sort), [rows, sort]);
  const { data, page, pages, setPage, perPage, setPerPage, range, total } = usePagination(sorted, 10);

  const cycle = (key: keyof Row) => {
    setSort((prev) => {
      const dir = prev?.key === key ? nextDir(prev.dir) : 'asc';
      const next = dir === 'none' ? null : { key, dir as SortDir };
      return next;
    });
    setPage(1);
  };

  return (
    <div>
      <div className="controls" style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <label>
          Items per page:{' '}
          <Select
            value={perPage}
            onChange={(v) => { setPerPage(v); setPage(1); }}
            options={[5,10,20,50].map(v => ({ value: v, label: String(v) }))}
            aria-label="Items per page"
            style={{ width: 120 }}
          />
        </label>
        <div aria-live="polite" aria-atomic="true">Showing {range[0]}–{range[1]} of {total}</div>
      </div>

      <table role="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {(['id','name','value','category'] as (keyof Row)[]).map((k) => (
              <th key={k} scope="col" style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>
                <button
                  onClick={() => cycle(k)}
                  aria-label={`Sort by ${k}`}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}
                >
                  <SortHeader label={String(k)} active={sort?.key === k} dir={sort?.key === k ? sort!.dir : 'none'} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{r.id}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{r.name}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{r.value}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>{r.category}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav aria-label="Pagination" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <Button onClick={() => setPage(page-1)} disabled={page<=1}>Prev</Button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <Button key={p} type={p===page?'primary':'default'} onClick={() => setPage(p)} aria-current={p===page ? 'page' : undefined}>{p}</Button>
        ))}
        <Button onClick={() => setPage(page+1)} disabled={page>=pages}>Next</Button>
      </nav>
    </div>
  );
}
