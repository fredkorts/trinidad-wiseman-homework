import axios from 'axios';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import type { Article, Row } from '@/types';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? '',
  timeout: 10_000
});

export function cancelTokenSource() {
  const controller = new AbortController();
  return controller;
}

export async function getArticle(signal?: AbortSignal): Promise<Article> {
  const res = await client.get('/api/article', { signal });
  return res.data;
}

export async function getTable(signal?: AbortSignal): Promise<Row[]> {
  const res = await client.get('/api/table', { signal });
  return res.data;
}

// React Query hooks
export function useArticle(): UseQueryResult<Article> {
  return useQuery({
    queryKey: ['article'],
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
