import axios from 'axios';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Article, Row } from '@/types';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? '',
  timeout: 10_000
});

export function unixToDate(unixSec: number) {
  // API returns seconds; JS Date expects ms
  return new Date(unixSec * 1000);
}

export async function getArticle(signal?: AbortSignal): Promise<Article> {
  const url = 'https://proovitoo.twn.ee/api/list/972d2b8a';
  const res = await axios.get<Article>(url, { signal });
  return res.data;
}

export async function getTable(signal?: AbortSignal): Promise<Row[]> {
  const res = await client.get('/api/table', { signal });
  return res.data;
}

export function useArticle(): UseQueryResult<Article> {
  return useQuery({
    queryKey: ['article', '972d2b8a'],
    queryFn: ({ signal }) => getArticle(signal),
    retry: 2
  });
}

export function useTable(): UseQueryResult<Row[]> {
  return useQuery({
    queryKey: ['table'],
    queryFn: ({ signal }) => getTable(signal),
    retry: 2,
    staleTime: 60_000
  });
}
