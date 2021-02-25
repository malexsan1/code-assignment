import { extractTotalCount } from './utils';

interface PaginatedPayload {
  entity: 'posts' | 'users';
  page: number;
  limit: number;
}

interface PaginatedReponse<T> {
  data: T[];
  totalCount: number;
}

export async function getPaginatedData<T>({
  entity,
  page,
  limit,
}: PaginatedPayload): Promise<PaginatedReponse<T>> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/${entity}?_page=${page}&_limit=${limit}`,
  );

  const totalCount = extractTotalCount(response);
  const data: T[] = await response.json();

  return {
    data,
    totalCount,
  };
}
