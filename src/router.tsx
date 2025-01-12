import { createBrowserRouter } from 'react-router';
import DashboardLayout from './dashboard-layout';
import ErrorComponent from './error';
import {
  activityLogLoader,
  apiKeysLoader,
  applicationsLoader,
  authConfirmLoader,
  authorizationLogLoader,
  brandingLoginLoader,
  insightLoader,
  oauth2AuthorizeLoader,
  organizationsLoader,
  permissionsLoader,
  rolesLoader,
  securityAlertLoader,
  usersLoader,
  webhooksLoader,
} from './loaders';
import NotFoundComponent from './not-found';
import OrganizationLayout from './organization-layout';
import {
  ActivityLog,
  ApiKeys,
  Applications,
  AuthConfirm,
  AuthorizationLog,
  BrandingLogin,
  ForgotPassword,
  GoogleCreate,
  Insights,
  Login,
  OAuth2Authorize,
  Organizations,
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
import { AuthProtectedRoute, OrganizationProtectedRoute } from './protected';

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorComponent />,
    children: [
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
        path: '',
        element: <AuthProtectedRoute />,
        children: [
          {
            path: 'organizations',
            element: <OrganizationLayout />,
            children: [
              {
                path: '',
                loader: organizationsLoader,
                element: <Organizations />,
              },
            ],
          },
          {
            path: '',
            element: <OrganizationProtectedRoute />,
            children: [
              {
                path: '',
                element: <DashboardLayout />,
                children: [
                  { index: true, element: <QuickStart /> },
                  { path: 'profile', element: <Profile /> },
                  {
                    path: 'insights',
                    loader: insightLoader,
                    element: <Insights />,
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
                  {
                    path: 'api-keys',
                    loader: apiKeysLoader,
                    element: <ApiKeys />,
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
                        loader: authorizationLogLoader,
                        element: <AuthorizationLog />,
                      },
                      {
                        path: 'activity',
                        loader: activityLogLoader,
                        element: <ActivityLog />,
                      },
                      {
                        path: 'security',
                        loader: securityAlertLoader,
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
            ],
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

export default router;
