import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AppLayout from '../AppLayout';
import * as SidebarModule from '../Sidebar';
import { Sidebar } from '../Sidebar';
import { MobileHeader } from '../MobileHeader';
import { MOBILE_HEADER_COPY, NAVIGATION_COPY, ROUTES } from '@/constants';
import { useMediaQuery } from '@/hooks/useMediaQuery';

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: vi.fn(),
}));

const useMediaQueryMock = vi.mocked(useMediaQuery);

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={[ROUTES.HOME]}>
      <Routes>
        <Route path={ROUTES.HOME} element={<AppLayout />}>
          <Route index element={<div>Home</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

describe('AppLayout', () => {
  it('renders desktop layout without mobile header and keeps sidebar open', () => {
    useMediaQueryMock.mockReturnValue(false);
    const sidebarSpy = vi.spyOn(SidebarModule, 'Sidebar');

    const { container } = renderWithRouter();

    expect(screen.queryByRole('button', { name: MOBILE_HEADER_COPY.OPEN_SIDEBAR })).toBeNull();

    const sidebarCall = sidebarSpy.mock.calls.at(-1)?.[0];
    expect(sidebarCall?.id).toBe('app-sidebar');
    expect(sidebarCall?.isMobile).toBe(false);
    expect(sidebarCall?.open).toBe(true);

    const sidebar = container.querySelector('.tw-sider');
    expect(sidebar).not.toHaveClass('tw-sider--mobile');
    expect(sidebar?.getAttribute('aria-hidden')).not.toBe('true');

    const main = container.querySelector('main#main-content');
    expect(main).toBeInTheDocument();

    sidebarSpy.mockRestore();
  });

  it('toggles sidebar visibility on mobile via the header button', async () => {
    useMediaQueryMock.mockReturnValue(true);
    const sidebarSpy = vi.spyOn(SidebarModule, 'Sidebar');

    renderWithRouter();

    const toggle = screen.getByRole('button', { name: MOBILE_HEADER_COPY.OPEN_SIDEBAR });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', 'app-sidebar');

    const sidebarInitial = sidebarSpy.mock.calls[0]?.[0];
    expect(sidebarInitial?.isMobile).toBe(true);
    expect(sidebarInitial?.open).toBe(false);

    const user = userEvent.setup();
    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-label', MOBILE_HEADER_COPY.CLOSE_SIDEBAR);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');

    const sidebarAfterToggle = sidebarSpy.mock.calls.at(-1)?.[0];
    expect(sidebarAfterToggle?.open).toBe(true);

    const sidebar = document.querySelector('.tw-sider');
    expect(sidebar?.getAttribute('aria-hidden')).toBe('false');
    expect(sidebar?.id).toBe('app-sidebar');

    sidebarSpy.mockRestore();
  });
});

describe('Sidebar', () => {
  it('applies desktop styling and does not trigger onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(
      <MemoryRouter initialEntries={[ROUTES.HOME]}>
        <Sidebar id="sidebar" isMobile={false} open onClose={onClose} />
      </MemoryRouter>,
    );

    const sidebar = container.querySelector('.tw-sider');
    expect(sidebar).not.toHaveClass('tw-sider--mobile');
    expect(sidebar).not.toHaveClass('tw-sider--open');

    const menu = container.querySelector('.ant-menu');
    expect(menu).toBeInTheDocument();

    await user.click(within(menu as HTMLElement).getByText(NAVIGATION_COPY.TABLE));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('shows mobile modifiers and calls onClose when a menu item is selected', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { container } = render(
      <MemoryRouter initialEntries={[ROUTES.HOME]}>
        <Sidebar id="sidebar" isMobile open onClose={onClose} />
      </MemoryRouter>,
    );

    const sidebar = container.querySelector('.tw-sider');
    expect(sidebar).toHaveClass('tw-sider--mobile', 'tw-sider--open');
    expect(sidebar).toHaveAttribute('aria-hidden', 'false');

    const menu = container.querySelector('.ant-menu');
    expect(menu).toBeInTheDocument();

    await user.click(within(menu as HTMLElement).getByText(NAVIGATION_COPY.ARTICLE));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides the sidebar when closed on mobile', () => {
    const { container } = render(
      <MemoryRouter initialEntries={[ROUTES.HOME]}>
        <Sidebar id="sidebar" isMobile open={false} />
      </MemoryRouter>,
    );

    const sidebar = container.querySelector('.tw-sider');
    expect(sidebar).toHaveClass('tw-sider--mobile');
    expect(sidebar).not.toHaveClass('tw-sider--open');
    expect(sidebar).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('MobileHeader', () => {
  it('switches labels based on the open state', () => {
    const { rerender } = render(
      <MobileHeader
        isOpen={false}
        onToggle={() => {
          /* noop */
        }}
        sidebarId="sidebar"
      />,
    );

    const button = screen.getByRole('button', { name: MOBILE_HEADER_COPY.OPEN_SIDEBAR });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'sidebar');

    rerender(
      <MobileHeader
        isOpen
        onToggle={() => {
          /* noop */
        }}
        sidebarId="sidebar"
      />,
    );

    const closeButton = screen.getByRole('button', { name: MOBILE_HEADER_COPY.CLOSE_SIDEBAR });
    expect(closeButton).toHaveAttribute('aria-expanded', 'true');
    expect(closeButton).toHaveAttribute('aria-controls', 'sidebar');
  });
});
