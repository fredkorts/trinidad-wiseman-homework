import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TablePage from '../Table';
import { TABLE_PAGE_COPY } from '@/constants';
import { useTable } from '@/services/api';
import CustomTable from '@/components/table/CustomTable';
import type { Mock } from 'vitest';

vi.mock('@/services/api', () => ({
  useTable: vi.fn(),
}));

vi.mock('@/components/table/CustomTable', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="custom-table" />),
}));

const useTableMock = vi.mocked(useTable);
const CustomTableMock = CustomTable as unknown as Mock;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('TablePage', () => {
  it('renders a skeleton while loading', () => {
    useTableMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as never);

    const { container } = render(<TablePage />);
    expect(container.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('renders an error alert when the query fails', () => {
    useTableMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed'),
    } as never);

    render(<TablePage />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(TABLE_PAGE_COPY.LOAD_ERROR);
    expect(alert).toHaveTextContent('Failed');
  });

  it('renders the table with returned data', () => {
    const rows = [
      { firstName: 'Jane', lastName: 'Doe', sex: 'Naine', birthDate: 1, phone: '555' },
    ];

    useTableMock.mockReturnValue({
      data: rows,
      isLoading: false,
      isError: false,
      error: null,
    } as never);

    render(<TablePage />);

    expect(screen.getByRole('heading', { level: 1, name: TABLE_PAGE_COPY.TITLE })).toBeInTheDocument();
    expect(CustomTableMock).toHaveBeenCalledWith({ rows }, undefined);
    expect(screen.getByTestId('custom-table')).toBeInTheDocument();
  });

  it('passes an empty array to the table when data is missing', () => {
    useTableMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as never);

    render(<TablePage />);

    expect(CustomTableMock).toHaveBeenCalledWith({ rows: [] }, undefined);
  });
});
