import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Loader } from './components';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorComponent from './error';
import Layout from './layout';
import NotFoundComponent from './not-found';
import ProtectedRoute from './protected';

import {
  ActivityLog,
  Applications,
  AuthConfirm,
  AuthorizationLog,
  BrandingLogin,
  ForgotPassword,
  GoogleCreate,
  Insight,
  Login,
  OAuth2Authorize,
  Permissions,
  Profile,
  QuickStart,
  Register,
  ResetPassword,
  Roles,
  SecurityLog,
  TwoFactorAuthentication,
  TwoFactorBackup,
  UserConfirm,
  Users,
  Webhooks,
} from './pages';

import {
  applicationsLoader,
  authConfirmLoader,
  brandingLoginLoader,
  insightLoader,
  oauth2AuthorizeLoader,
  permissionsLoader,
  rolesLoader,
  usersLoader,
  webhooksLoader,
} from './loaders';

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
            loader: insightLoader,
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
                element: <BrandingLogin />,
                loader: brandingLoginLoader,
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
            loader: oauth2AuthorizeLoader,
            element: <OAuth2Authorize />,
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
      <AuthProvider>
        <Suspense fallback={<Loader loading={true} />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
