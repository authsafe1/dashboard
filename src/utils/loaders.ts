import { type LoaderFunction, redirect } from 'react-router';

// Centralized API helper function
const fetchApi = async (
  url: string,
  options: RequestInit = { method: 'GET', credentials: 'include' },
) => {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      return await response.json();
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
const fetchPaginatedData = async (
  baseUrl: string,
  skip: number,
  take: number,
) => {
  const dataUrl = `${baseUrl}/all`;
  const countUrl = `${baseUrl}/count`;

  const dataPromise = fetchApi(dataUrl, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skip, take }),
  });

  const countPromise = fetchApi(countUrl);

  const [all, count] = await Promise.all([dataPromise, countPromise]);
  return { all, count };
};

// Individual loaders
export const authConfirmLoader: LoaderFunction = async ({ request }) => {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) throw new Error('Token is required');
  const url = `${import.meta.env.VITE_API_URL}/profile/confirm?token=${token}`;
  return fetchApi(url, { method: 'POST' });
};

export const organizationsLoader: LoaderFunction = async ({ request }) => {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/organization`,
    +skip,
    +take,
  );
};

export const applicationsLoader: LoaderFunction = async ({ request }) => {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/client`,
    +skip,
    +take,
  );
};

export const usersLoader: LoaderFunction = async ({ request }) => {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/user`,
    +skip,
    +take,
  );
};

export const permissionsLoader: LoaderFunction = async ({ request }) => {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/permission`,
    +skip,
    +take,
  );
};

export const rolesLoader: LoaderFunction = async ({ request }) => {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/role`,
    +skip,
    +take,
  );
};

export const webhooksLoader: LoaderFunction = async ({ request }) => {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/webhook`,
    +skip,
    +take,
  );
};

export const apiKeysLoader: LoaderFunction = async ({ request }) => {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/api-key`,
    +skip,
    +take,
  );
};

export const activityLogLoader: LoaderFunction = async ({ request }) => {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/profile/log/activity`,
    +skip,
    +take,
  );
};

export const securityAlertLoader: LoaderFunction = async ({ request }) => {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/profile/log/security`,
    +skip,
    +take,
  );
};

export const authorizationLogLoader: LoaderFunction = async ({ request }) => {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/profile/log/authorization`,
    +skip,
    +take,
  );
};

export const brandingLoginLoader: LoaderFunction = async ({ params }) => {
  const url = `${import.meta.env.VITE_API_URL}/client/branding/${
    params.applicationId
  }`;
  return fetchApi(url);
};

export const oauth2AuthorizeLoader: LoaderFunction = async ({ request }) => {
  const organizationId = new URL(request.url).searchParams.get(
    'organization_id',
  );
  if (!organizationId) return null;
  const url = `${
    import.meta.env.VITE_API_URL
  }/organization/branding?organizationId=${organizationId}`;
  return fetchApi(url);
};

export const insightLoader: LoaderFunction = async () => {
  const endpoints = [
    `${import.meta.env.VITE_API_URL}/organization/count`,
    `${import.meta.env.VITE_API_URL}/profile/log/authorization/count`,
    `${import.meta.env.VITE_API_URL}/profile/log/security/count`,
    `${import.meta.env.VITE_API_URL}/profile/log/activity/data`,
  ];

  const data = await Promise.all(endpoints.map((url) => fetchApi(url)));
  return data;
};
