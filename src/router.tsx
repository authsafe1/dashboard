import {createBrowserRouter} from 'react-router';
import DashboardLayout from './layouts/dashboard-layout';
import OrganizationLayout from './layouts/organization-layout';
import {
  ApiKeys,
  Applications,
  AuthConfirm,
  Billing,
  BrandingLogin,
  Error,
  ForgotPassword,
  GoogleCreate,
  Insights,
  Log,
  Login,
  NotFound,
  OAuth2Authorize,
  Organizations,
  Permissions,
  Profile,
  QuickStart,
  Register,
  ResetPassword,
  Roles,
  TwoFactorAuthentication,
  TwoFactorBackup,
  UserConfirm,
  Users,
  Webhooks,
} from './pages';
import {AuthProtectedRoute, OrganizationProtectedRoute} from './protected';
import {
  apiKeysLoader,
  applicationsLoader,
  authConfirmLoader,
  brandingLoginLoader,
  insightLoader,
  oauth2AuthorizeLoader,
  organizationsLoader,
  permissionsLoader,
  rolesLoader,
  usersLoader,
  webhooksLoader,
} from './utils/loaders';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <Error/>,
    children: [
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: <Login/>,
          },
          {
            path: 'register',
            element: <Register/>,
          },
          {
            path: 'google/create',
            element: <GoogleCreate/>,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword/>,
          },
          {
            path: 'reset-password',
            element: <ResetPassword/>,
          },
          {
            path: 'confirm',
            loader: authConfirmLoader,
            element: <AuthConfirm/>,
          },
          {
            path: '2fa',
            element: <TwoFactorAuthentication/>,
          },
          {
            path: '2fa/backup',
            element: <TwoFactorBackup/>,
          },
        ],
      },
      {
        path: 'user',
        children: [
          {
            path: 'confirm',
            element: <UserConfirm/>,
          },
        ],
      },
      {
        path: 'oauth2',
        children: [
          {
            path: 'authorize',
            loader: oauth2AuthorizeLoader,
            element: <OAuth2Authorize/>,
          },
        ],
      },
      {
        path: '',
        element: <AuthProtectedRoute/>,
        children: [
          {
            path: '',
            element: <OrganizationLayout/>,
            children: [
              {
                index: true,
                loader: insightLoader,
                element: <Insights/>,
              },
              {path: 'profile', element: <Profile/>},
              {
                path: 'billing',
                element: <Billing/>,
              },
              {
                path: 'organizations',
                loader: organizationsLoader,
                element: <Organizations/>,
              },
              {
                path: 'log',
                element: <Log/>
              },
            ],
          },
          {
            path: 'organizations',
            element: <OrganizationProtectedRoute/>,
            children: [
              {
                path: ':organizationId',
                element: <DashboardLayout/>,
                children: [
                  {index: true, element: <QuickStart/>},
                  {
                    path: 'applications',
                    loader: applicationsLoader,
                    element: <Applications/>,
                  },
                  {
                    path: 'applications/:applicationId/branding',
                    loader: brandingLoginLoader,
                    element: <BrandingLogin/>,
                  },
                  {
                    path: 'users',
                    loader: usersLoader,
                    element: <Users/>,
                  },
                  {
                    path: 'roles',
                    loader: rolesLoader,
                    element: <Roles/>,
                  },
                  {
                    path: 'permissions',
                    loader: permissionsLoader,
                    element: <Permissions/>,
                  },
                  {
                    path: 'webhooks',
                    loader: webhooksLoader,
                    element: <Webhooks/>,
                  },
                  {
                    path: 'api-keys',
                    loader: apiKeysLoader,
                    element: <ApiKeys/>,
                  },
                  // {
                  //   path: 'branding',
                  //   children: [
                  //     {
                  //       path: 'login',
                  //       element: <BrandingLogin />,
                  //       loader: brandingLoginLoader,
                  //     },
                  //   ],
                  // },
                ],
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFound/>,
      },
    ],
  },
]);

export default router;
