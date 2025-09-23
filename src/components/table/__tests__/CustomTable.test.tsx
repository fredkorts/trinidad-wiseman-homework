import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import CustomTable from '../CustomTable';
import { TABLE_A11Y_COPY, TABLE_COLUMN_LABELS } from '@/constants';
import type { Row } from '@/types';

const baseTimestamp = 1609459200; // 01.01.2021

afterEach(() => {
  cleanup();
});

function createRows(total = 75): Row[] {
  const seed: Row[] = [
    {
      firstName: 'Charlie',
      lastName: 'Zulu',
      sex: 'Mees',
      birthDate: baseTimestamp + 86400 * 2,
      phone: '+372 555-0100',
    },
    {
      firstName: 'Alpha',
      lastName: 'Mike',
      sex: 'Naine',
      birthDate: baseTimestamp,
      phone: '+372 555-099',
    },
    {
      firstName: 'Bravo',
      lastName: 'Alpha',
      sex: 'Mees',
      birthDate: baseTimestamp + 86400,
      phone: '+372 555 002',
    },
  ];

  const rows = seed.slice(0, Math.min(total, seed.length));

  for (let i = rows.length; i < total; i += 1) {
    rows.push({
      firstName: `Person${i}`,
      lastName: `Last${i}`,
      sex: i % 2 === 0 ? 'Mees' : 'Naine',
      birthDate: baseTimestamp + i * 86400,
      phone: `555000${String(i).padStart(2, '0')}`,
    });
  }

  return rows;
}

describe('CustomTable', () => {
  it('formats birth dates and sorts phone numbers numerically', async () => {
    const rows = createRows(3);
    const user = userEvent.setup();
    render(<CustomTable rows={rows} />);

    const firstDataRow = screen.getAllByRole('row')[1];
    expect(within(firstDataRow).getByText(rows[0].firstName)).toBeInTheDocument();
    expect(within(firstDataRow).getByText('03.01.2021')).toBeInTheDocument();
    expect(within(firstDataRow).getByText(rows[0].phone)).toBeInTheDocument();

    const phoneHeaderButton = within(screen.getAllByRole('columnheader')[4]).getByRole('button', {
      name: `${TABLE_A11Y_COPY.SORT_BUTTON_PREFIX}${TABLE_COLUMN_LABELS.PHONE}`,
    });

    await user.click(phoneHeaderButton);

    const expectedPhoneOrder = [...rows].sort(
      (a, b) => Number(a.phone.replace(/\D/g, '')) - Number(b.phone.replace(/\D/g, '')),
    );
    const sortedFirstRow = screen.getAllByRole('row')[1];
    expect(within(sortedFirstRow).getByText(expectedPhoneOrder[0].firstName)).toBeInTheDocument();
    expect(within(sortedFirstRow).getByText(expectedPhoneOrder[0].phone)).toBeInTheDocument();
  });

  it('cycles sort state and updates aria attributes', async () => {
    const rows = createRows(15);
    const user = userEvent.setup();
    render(<CustomTable rows={rows} />);

    const firstNameHeader = screen.getAllByRole('columnheader')[0];
    expect(firstNameHeader).toHaveAttribute('aria-sort', 'none');

    const sortButton = within(firstNameHeader).getByRole('button', {
      name: `${TABLE_A11Y_COPY.SORT_BUTTON_PREFIX}${TABLE_COLUMN_LABELS.FIRST_NAME}`,
    });

    const readFirstColumn = () =>
      Array.from(document.querySelectorAll<HTMLTableRowElement>('.tw-table__body .tw-table__row'))
        .slice(0, 5)
        .map((row) => row.cells[0]?.textContent ?? '');

    const collator = new Intl.Collator('et', { sensitivity: 'base', numeric: true });
    const expectedAsc = [...rows].sort((a, b) => collator.compare(a.firstName, b.firstName));
    const expectedDesc = [...expectedAsc].reverse();

    await user.click(sortButton);
    expect(firstNameHeader).toHaveAttribute('aria-sort', 'ascending');
    expect(
      within(firstNameHeader).getByText(
        `${TABLE_COLUMN_LABELS.FIRST_NAME} ${TABLE_A11Y_COPY.SORT_ASC_SUFFIX.trim()}`,
      ),
    ).toBeInTheDocument();
    const ascValues = readFirstColumn();
    expect(ascValues[0]).toBe(expectedAsc[0].firstName);

    await user.click(sortButton);
    expect(firstNameHeader).toHaveAttribute('aria-sort', 'descending');
    expect(
      within(firstNameHeader).getByText(
        `${TABLE_COLUMN_LABELS.FIRST_NAME} ${TABLE_A11Y_COPY.SORT_DESC_SUFFIX.trim()}`,
      ),
    ).toBeInTheDocument();
    const descValues = readFirstColumn();
    expect(descValues[0]).toBe(expectedDesc[0].firstName);
  });

  it('resets to page 1 after sorting a new column and windows pagination buttons', async () => {
    const rows = createRows();
    const user = userEvent.setup();
    render(<CustomTable rows={rows} />);

    const pagination = screen.getAllByLabelText<HTMLDivElement>(TABLE_A11Y_COPY.PAGINATION_ARIA_LABEL, {
      selector: 'nav',
    })[0];
    const numberButtons = () =>
      within(pagination)
        .getAllByRole('button')
        .filter((btn) => /^\d+$/.test(btn.textContent ?? ''))
        .map((btn) => btn.textContent ?? '');

    expect(numberButtons()).toEqual(['1', '2', '3', '4', '5']);

    const pageButton = (label: string) => within(pagination).getAllByRole('button', { name: label })[0];

    await user.click(pageButton('4'));
    expect(pageButton('4')).toHaveAttribute('aria-current', 'page');
    expect(numberButtons()).toEqual(['2', '3', '4', '5', '6']);

    const lastNameHeader = screen.getAllByRole('columnheader')[1];
    const lastNameButton = within(lastNameHeader).getByRole('button', {
      name: `${TABLE_A11Y_COPY.SORT_BUTTON_PREFIX}${TABLE_COLUMN_LABELS.LAST_NAME}`,
    });
    await user.click(lastNameButton);

    expect(pageButton('1')).toHaveAttribute('aria-current', 'page');
    expect(numberButtons()).toEqual(['1', '2', '3', '4', '5']);
  });

  it('disables previous and next navigation at the bounds', async () => {
    const rows = createRows();
    const user = userEvent.setup();
    render(<CustomTable rows={rows} />);

    const pagination = screen.getAllByLabelText<HTMLDivElement>(TABLE_A11Y_COPY.PAGINATION_ARIA_LABEL, {
      selector: 'nav',
    })[0];
    const prev = within(pagination).getAllByRole('button', { name: TABLE_A11Y_COPY.PREVIOUS_PAGE })[0];
    const next = within(pagination).getAllByRole('button', { name: TABLE_A11Y_COPY.NEXT_PAGE })[0];
    const pageButton = (label: string) => within(pagination).getAllByRole('button', { name: label })[0];

    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();

    await user.click(pageButton('4'));
    await user.click(pageButton('6'));
    await user.click(pageButton('8'));

    expect(next).toBeDisabled();
    expect(prev).not.toBeDisabled();
  });
});
