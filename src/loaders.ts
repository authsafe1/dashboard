import { type LoaderFunction, redirect } from 'react-router';

export const authConfirmLoader: LoaderFunction = async ({ request }) => {
  const token = new URL(request.url).searchParams.get('token');
  return await fetch(
    `${import.meta.env.VITE_API_URL}/organization/confirm?token=${token}`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

export const applicationsLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/client/all`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const usersLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/user/all`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const permissionsLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/permission/all`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const rolesLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/role/all`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const webhooksLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/webhook/all`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const brandingLoginLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/organization/branding`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const oauth2AuthorizeLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const organizationId = url.searchParams.get('organization_id');

  if (organizationId) {
    return await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/organization/branding?organizationId=${organizationId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } else {
    return null;
  }
};

export const insightLoader: LoaderFunction = async () => {
  const dashboardUrl = [
    { url: `${import.meta.env.VITE_API_URL}/user/count`, method: 'GET' },
    { url: `${import.meta.env.VITE_API_URL}/client/count`, method: 'GET' },
    {
      url: `${import.meta.env.VITE_API_URL}/organization/log/security/count`,
      method: 'GET',
    },
    {
      url: `${import.meta.env.VITE_API_URL}/organization/log/activity/data`,
      method: 'GET',
    },
  ];
  return await Promise.all(
    dashboardUrl.map(async ({ url, method }) => {
      try {
        const response = await fetch(url, {
          method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.redirected || !response.ok) {
          throw new Error('Unauthorized');
        } else {
          return await response.json();
        }
      } catch {
        return redirect('/auth/login');
      }
    }),
  );
};
