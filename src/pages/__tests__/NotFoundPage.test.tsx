import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import NotFoundPage from '../NotFound';
import AppLayout from '@/components/layout/AppLayout';
import { NOT_FOUND_COPY, ROUTES } from '@/constants';

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: () => false,
}));

afterEach(() => {
  cleanup();
});

describe('NotFoundPage', () => {
  it('displays an accessible message and home link', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: NOT_FOUND_COPY.TITLE })).toBeInTheDocument();
    expect(screen.getByText(NOT_FOUND_COPY.DESCRIPTION)).toBeInTheDocument();

    const homeLink = screen.getByRole('link', { name: NOT_FOUND_COPY.ACTION });
    expect(homeLink).toHaveAttribute('href', ROUTES.HOME);
  });

  it('renders for unmatched routes', () => {
    render(
      <MemoryRouter initialEntries={["/missing"]}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.HOME} element={<div>Home</div>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: NOT_FOUND_COPY.TITLE })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: NOT_FOUND_COPY.ACTION })).toBeInTheDocument();
  });
});
