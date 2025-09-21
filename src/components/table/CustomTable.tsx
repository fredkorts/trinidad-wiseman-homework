import { useMemo, useState } from 'react';
import type { Row } from '@/types';
import { nextDir, type SortDir, type SortState } from '@/utils/sort';
import { usePagination } from '@/hooks/usePagination';
import { Select, Button } from 'antd';

interface Props { rows: Row[]; }

/** Values we can compare */
type Comparable = string | number | boolean | Date | null | undefined;

/** Column config: how to read and (optionally) compare */
interface Column<T> {
  key: keyof T;
  label: string;
  accessor: (row: T) => Comparable;
  compare?: (a: T, b: T) => number;
}

/** Locale-aware (Estonian) + numeric string collation */
const collator = new Intl.Collator('et', { sensitivity: 'base', numeric: true });

/** Default comparison with nulls last + Date -> number */
function defaultCompare(a: Comparable, b: Comparable): number {
  const aEmpty = a == null, bEmpty = b == null;
  if (aEmpty && !bEmpty) return 1;
  if (!aEmpty && bEmpty) return -1;
  if (aEmpty && bEmpty) return 0;

  const ax = a instanceof Date ? a.getTime() : a;
  const bx = b instanceof Date ? b.getTime() : b;

  if (typeof ax === 'number' && typeof bx === 'number') {
    return ax === bx ? 0 : ax > bx ? 1 : -1;
  }
  return collator.compare(String(a), String(b));
}

/** Column setup: clear, extensible, no dynamic indexing */
const COLUMNS: Column<Row>[] = [
  { key: 'firstName', label: 'Eesnimi', accessor: r => r.firstName },
  { key: 'lastName',  label: 'Perekonnanimi', accessor: r => r.lastName },
  { key: 'sex',       label: 'Sugu', accessor: r => r.sex },
  // unix seconds → sort numerically
  { key: 'birthDate', label: 'Sünnikuupäev', accessor: r => r.birthDate },
  // phone: sort by numeric digits (natural order)
  { key: 'phone',     label: 'Telefon', accessor: r => Number(r.phone.replace(/\D/g, '')) },
];

function SortHeader({ label, active, dir }: { label: string; active: boolean; dir: SortDir }) {
  const suffix = !active ? '' : dir === 'asc' ? ' ▲' : dir === 'desc' ? ' ▼' : '';
  return <span aria-live="polite">{label}{suffix}</span>;
}

function formatCell<K extends keyof Row>(row: Row, key: K) {
  const v = row[key];
  if (key === 'birthDate' && typeof v === 'number') {
    // dd.MM.yyyy
    const d = new Date(v * 1000);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}.${mm}.${yyyy}`;
  }
  return String(v ?? '');
}

export default function CustomTable({ rows }: Props) {
  const [sort, setSort] = useState<SortState<keyof Row> | null>(null);

  const activeCol = COLUMNS.find(c => c.key === sort?.key);

  const sorted = useMemo<Row[]>(() => {
    if (!sort || sort.dir === 'none' || !activeCol) return rows;
    const { accessor, compare } = activeCol;
    return [...rows].sort((a, b) => {
      const base = compare ? compare(a, b) : defaultCompare(accessor(a), accessor(b));
      return sort.dir === 'asc' ? base : -base;
    });
  }, [rows, sort, activeCol]);

  const { data, page, pages, setPage, perPage, setPerPage, range, total } =
    usePagination<Row>(sorted, 10);

  const cycle = (key: keyof Row) => {
    setSort((prev) => {
      const dir: SortDir = prev?.key === key ? nextDir(prev.dir) : 'asc';
      return dir === 'none' ? null : { key, dir };
    });
    setPage(1);
  };

  return (
    <div>
      <div className="controls" style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <label>
          Items per page{' '}
          <Select
            value={perPage}
            onChange={(v) => { setPerPage(v); setPage(1); }}
            options={[5,10,20,50].map(v => ({ value: v, label: String(v) }))}
            aria-label="Items per page"
            style={{ width: 120 }}
          />
        </label>
        <div aria-live="polite" aria-atomic="true">Näitan {range[0]}–{range[1]} / {total}</div>
      </div>

      <table role="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {COLUMNS.map(({ key, label }) => {
              const active = sort?.key === key;
              const dir: SortDir = active ? sort!.dir : 'none';
              return (
                <th key={String(key)} scope="col" style={{ textAlign: 'left', borderBottom: '1px solid #eee', padding: 8 }}>
                  <button
                    onClick={() => cycle(key)}
                    aria-label={`Sorteeri veerg: ${label}`}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit' }}
                  >
                    <SortHeader label={label} active={!!active} dir={dir} />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={`${r.firstName}-${r.lastName}-${i}`}>
              {COLUMNS.map(({ key }) => (
                <td key={String(key)} style={{ padding: 8, borderBottom: '1px solid #f5f5f5' }}>
                  {formatCell(r, key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <nav aria-label="Lehekülgede vahetus" style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <Button onClick={() => setPage(page-1)} disabled={page<=1}>{'<'}</Button>
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <Button key={p} type={p===page?'primary':'default'} onClick={() => setPage(p)} aria-current={p===page ? 'page' : undefined}>{p}</Button>
        ))}
        <Button onClick={() => setPage(page+1)} disabled={page>=pages}>{'>'}</Button>
      </nav>
    </div>
  );
}
