import axios from 'axios';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Article, Row, TwnListItem } from '@/types';
import { API_ENDPOINTS, QUERY_KEYS, SEX_CODES, SEX_LABELS } from '@/constants';


export function unixToDate(unixSec: number) {
  // API returns seconds; JS Date expects ms
  return new Date(unixSec * 1000);
}

export async function getArticle(signal?: AbortSignal): Promise<Article> {
  const res = await axios.get<Article>(API_ENDPOINTS.ARTICLE, { signal });
  return res.data;
}

async function getTwnList(signal?: AbortSignal): Promise<TwnListItem[]> {
  const res = await axios.get<{ list: TwnListItem[] }>(API_ENDPOINTS.LIST, { signal });
  return res.data.list;
}

export async function getTable(signal?: AbortSignal): Promise<Row[]> {
  const list = await getTwnList(signal);
  return list.map((p) => ({
    firstName: p.firstname,
    lastName: p.surname,
    sex: p.sex === SEX_CODES.MALE ? SEX_LABELS.MALE : SEX_LABELS.FEMALE,
    birthDate: p.date,      // keep numeric; UI will render dd.MM.yyyy
    phone: p.phone,
  }));
}

export function useArticle(): UseQueryResult<Article> {
  return useQuery({
    queryKey: QUERY_KEYS.ARTICLE,
    queryFn: ({ signal }) => getArticle(signal),
    retry: 2
  });
}

export function useTable(): UseQueryResult<Row[]> {
  return useQuery({
    queryKey: QUERY_KEYS.TABLE,
    queryFn: ({ signal }) => getTable(signal),
    retry: 2,
    staleTime: 60_000,
  });
}
