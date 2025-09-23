import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ArticlePage from '../Article';
import { ARTICLE_PAGE_COPY } from '@/constants';
import { useArticle } from '@/services/api';
import type { Article } from '@/types';

vi.mock('@/services/api', () => ({
  useArticle: vi.fn(),
}));

const useArticleMock = vi.mocked(useArticle);
let originalTitle: string;

beforeEach(() => {
  originalTitle = document.title;
  vi.clearAllMocks();
});

describe('ArticlePage', () => {
  it('renders a skeleton while loading', () => {
    useArticleMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as never);

    const { container } = render(<ArticlePage />);
    expect(container.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('shows an error alert when the query fails', () => {
    useArticleMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Boom'),
    } as never);

    render(<ArticlePage />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(ARTICLE_PAGE_COPY.LOAD_ERROR);
    expect(alert).toHaveTextContent('Boom');
  });

  it('renders the article content and updates the document title', async () => {
    const article: Article = {
      id: 'a-1',
      boolean: false,
      phone: '+372 555-0100',
      date: 1_700_000_000,
      tags: ['design', 'ux'],
      sex: 'f',
      firstname: 'Jane',
      surname: 'Doe',
      email: 'jane@example.com',
      title: 'Great article',
      intro: '<p>Intro content</p>',
      body: '<p>Body content</p>',
      personal_code: 123456,
      image: {
        large: 'large.jpg',
        medium: 'medium.jpg',
        small: 'small.jpg',
        alt: 'Hero alt',
        title: 'Hero caption',
      },
      images: [],
    };

    useArticleMock.mockReturnValue({
      data: article,
      isLoading: false,
      isError: false,
      error: null,
    } as never);

    render(<ArticlePage />);

    expect(screen.getByRole('heading', { level: 1, name: article.title })).toBeInTheDocument();
    expect(screen.getByLabelText(ARTICLE_PAGE_COPY.INTRO_SECTION_ARIA_LABEL)).toHaveTextContent(
      'Intro content',
    );
    expect(screen.getByRole('img', { name: 'Hero alt' })).toBeInTheDocument();
    expect(screen.getByText('Hero caption')).toBeInTheDocument();
    expect(screen.getByLabelText(ARTICLE_PAGE_COPY.BODY_SECTION_ARIA_LABEL)).toHaveTextContent(
      'Body content',
    );
    expect(screen.getByText('design')).toBeInTheDocument();
    expect(screen.getByText('ux')).toBeInTheDocument();

    await waitFor(() => expect(document.title).toBe(article.title));
  });

  it('renders nothing when data is null', () => {
    useArticleMock.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
    } as never);

    const { container } = render(<ArticlePage />);
    expect(container.firstChild).toBeNull();
  });
});

afterEach(() => {
  document.title = originalTitle;
});
