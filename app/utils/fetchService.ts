import { redirect } from 'react-router';

// Centralized API helper function
export const fetchApi = async <T>(
  url: string,
  options: RequestInit = { method: 'GET', credentials: 'include' },
) => {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      return (await response.json()) as T;
    } else if (response.redirected || response.status === 401) {
      throw new Error('Unauthorized');
    } else {
      throw new Error(`Error: ${response.statusText}`);
    }
  } catch {
    return redirect('/auth/login');
  }
};

// Common paginated data fetcher
export const fetchPaginatedData = async <T>(
  baseUrl: string,
  skip: number,
  take: number,
) => {
  const dataUrl = `${baseUrl}/all`;
  const countUrl = `${baseUrl}/count`;

  const dataPromise = fetchApi<T>(dataUrl, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skip, take }),
  });

  const countPromise = fetchApi<number>(countUrl);

  const [all, count] = await Promise.all([dataPromise, countPromise]);
  return { all, count };
};
