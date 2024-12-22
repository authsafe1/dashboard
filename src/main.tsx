import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { GlobalStyles } from '@mui/material';
import { lazy, StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
  RouterProvider,
} from 'react-router';
import { Loader } from './components';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorComponent from './error';
import Layout from './layout';
import NotFoundComponent from './not-found';
import ProtectedRoute from './protected';

const Profile = lazy(() => import('./pages/profile/page'));
const Login = lazy(() => import('./pages/auth/login/page'));
const Register = lazy(() => import('./pages/auth/register/page'));
const GoogleCreate = lazy(() => import('./pages/auth/google/create/page'));
const ForgotPassword = lazy(() => import('./pages/auth/forgot-password/page'));
const ResetPassword = lazy(() => import('./pages/auth/reset-password/page'));
const AuthConfirm = lazy(() => import('./pages/auth/confirm/page'));
const TwoFactorAuthentication = lazy(() => import('./pages/auth/twofa/page'));
const TwoFactorBackup = lazy(() => import('./pages/auth/twofa/backup/page'));
const Applications = lazy(() => import('./pages/applications/page'));
const Insight = lazy(() => import('./pages/insights/page'));
const QuickStart = lazy(() => import('./pages/page'));
const Users = lazy(() => import('./pages/users/page'));
const Roles = lazy(() => import('./pages/roles/page'));
const Permissions = lazy(() => import('./pages/permissions/page'));
const Webhooks = lazy(() => import('./pages/webhooks/page'));
const AuthorizationLog = lazy(() => import('./pages/log/authorization/page'));
const BrandingLogin = lazy(() => import('./pages/branding/login/page'));
// const BrandingEmail = lazy(
//   () => import("./pages/dashboard/branding/email/page"),
// );
const UserConfirm = lazy(() => import('./pages/user/confirm/page'));
//const BillingPlan = lazy(() => import("./pages/dashboard/plan/billing/page"));
const SecurityLog = lazy(() => import('./pages/log/security/page'));
const ActivityLog = lazy(() => import('./pages/log/activity/page'));
const OAuth2Authorization = lazy(() => import('./pages/oauth2/authorize/page'));

const authConfirmLoader = async ({ request }: LoaderFunctionArgs<any>) => {
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

const applicationsLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/client/all`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const usersLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/user/all`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const permissionsLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/permission/all`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const rolesLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/role/all`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const webhooksLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/webhook/all`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const brandingLoader: LoaderFunction = async () => {
  return await fetch(`${import.meta.env.VITE_API_URL}/organization/branding`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const oauth2Loader: LoaderFunction = async ({ request }) => {
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

const dashboardLoader: LoaderFunction = async () => {
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
        return redirect('/auth/signin');
      }
    }),
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorComponent />,
    children: [
      {
        path: '',
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'profile', element: <Profile /> },
          { path: '', element: <QuickStart /> },
          {
            path: 'insights',
            element: <Insight />,
            loader: dashboardLoader,
          },
          {
            path: 'applications',
            loader: applicationsLoader,
            element: <Applications />,
          },
          {
            path: 'users',
            loader: usersLoader,
            element: <Users />,
          },
          {
            path: 'roles',
            loader: rolesLoader,
            element: <Roles />,
          },
          {
            path: 'permissions',
            loader: permissionsLoader,
            element: <Permissions />,
          },
          {
            path: 'webhooks',
            loader: webhooksLoader,
            element: <Webhooks />,
          },
          // {
          //   path: "plan",
          //   children: [
          //     {
          //       path: "billing",
          //       element: <BillingPlan />,
          //     },
          //   ],
          // },
          {
            path: 'log',
            children: [
              {
                path: 'authorization',
                element: <AuthorizationLog />,
              },
              {
                path: 'activity',
                element: <ActivityLog />,
              },
              {
                path: 'security',
                element: <SecurityLog />,
              },
            ],
          },
          {
            path: 'branding',
            children: [
              {
                path: 'login',
                loader: brandingLoader,
                element: <BrandingLogin />,
              },
              // {
              //   path: "email",
              //   element: <BrandingEmail />,
              // },
            ],
          },
        ],
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'google/create',
            element: <GoogleCreate />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
          },
          {
            path: 'reset-password',
            element: <ResetPassword />,
          },
          {
            path: 'confirm',
            loader: authConfirmLoader,
            element: <AuthConfirm />,
          },
          {
            path: '2fa',
            element: <TwoFactorAuthentication />,
          },
          {
            path: '2fa/backup',
            element: <TwoFactorBackup />,
          },
        ],
      },
      {
        path: 'user',
        children: [
          {
            path: 'confirm',
            element: <UserConfirm />,
          },
        ],
      },
      {
        path: 'oauth2',
        children: [
          {
            path: 'authorize',
            loader: oauth2Loader,
            element: <OAuth2Authorization />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundComponent />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <ThemeProvider>
      <GlobalStyles
        styles={{
          '*': {
            userSelect: 'none',
            msUserSelect: 'none',
            MozUserSelect: 'none',
          },
        }}
      />
      <AuthProvider>
        <Suspense fallback={<Loader loading={true} />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
