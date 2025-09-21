import axios from 'axios';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Article, Row, TwnListItem } from '@/types';


export function unixToDate(unixSec: number) {
  // API returns seconds; JS Date expects ms
  return new Date(unixSec * 1000);
}

export async function getArticle(signal?: AbortSignal): Promise<Article> {
  const url = 'https://proovitoo.twn.ee/api/list/972d2b8a';
  const res = await axios.get<Article>(url, { signal });
  return res.data;
}

async function getTwnList(signal?: AbortSignal): Promise<TwnListItem[]> {
  const url = 'https://proovitoo.twn.ee/api/list';
  const res = await axios.get<{ list: TwnListItem[] }>(url, { signal });
  return res.data.list;
}

export async function getTable(signal?: AbortSignal): Promise<Row[]> {
  const list = await getTwnList(signal);
  return list.map((p) => ({
    firstName: p.firstname,
    lastName: p.surname,
    sex: p.sex === 'm' ? 'Mees' : 'Naine',
    birthDate: p.date,      // keep numeric; UI will render dd.MM.yyyy
    phone: p.phone,
  }));
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
    queryKey: ['table', 'twn-list'],
    queryFn: ({ signal }) => getTable(signal),
    retry: 2,
    staleTime: 60_000,
  });
}
