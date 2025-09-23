import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS, SEX_LABELS } from '@/constants';
import type { Row, TwnListItem } from '@/types';
import * as Api from '../api';

const mockedAxiosGet = vi.mocked(axios.get);
const useQueryMock = vi.mocked(useQuery);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('api utilities', () => {
  it('converts unix seconds to Date objects', () => {
    const date = Api.unixToDate(123);
    expect(date.getTime()).toBe(123_000);
  });

  it('maps API list items into table rows', async () => {
    const listItem: TwnListItem = {
      id: '1',
      boolean: true,
      phone: '+372 555-0100',
      date: 1_700_000_000,
      tags: ['tag'],
      sex: 'm',
      firstname: 'John',
      surname: 'Doe',
      email: 'john@example.com',
      title: 'Title',
      intro: '<p>Intro</p>',
      body: '<p>Body</p>',
      personal_code: 123,
      image: { large: 'large.jpg', medium: 'medium.jpg', small: 'small.jpg', alt: 'alt', title: 'title' },
      images: [],
    };

    mockedAxiosGet.mockResolvedValueOnce({ data: { list: [listItem] } });

    const rows = await Api.getTable();

    expect(mockedAxiosGet).toHaveBeenCalledWith(API_ENDPOINTS.LIST, { signal: undefined });
    expect(rows).toEqual<Row[]>([
      {
        firstName: 'John',
        lastName: 'Doe',
        sex: SEX_LABELS.MALE,
        birthDate: listItem.date,
        phone: listItem.phone,
      },
    ]);
  });

  it('configures useTable query options', () => {
    useQueryMock.mockImplementation(() => ({}) as never);

    Api.useTable();

    expect(useQueryMock).toHaveBeenCalledTimes(1);
    const options = useQueryMock.mock.calls[0]?.[0];
    expect(options).toBeDefined();
    expect(options?.queryKey).toEqual(QUERY_KEYS.TABLE);
    expect(options?.retry).toBe(2);
    expect(options?.staleTime).toBe(60_000);
    expect(typeof options?.queryFn).toBe('function');
  });

  it('configures useArticle query options', () => {
    useQueryMock.mockImplementation(() => ({}) as never);

    Api.useArticle();

    const options = useQueryMock.mock.calls.at(-1)?.[0];
    expect(options).toBeDefined();
    expect(options?.queryKey).toEqual(QUERY_KEYS.ARTICLE);
    expect(options?.retry).toBe(2);
    expect(options?.staleTime).toBeUndefined();
    expect(typeof options?.queryFn).toBe('function');
  });
});
