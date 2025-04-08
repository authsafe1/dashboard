import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

const routes: RouteConfig = [
  ...prefix('auth', [
    route('login', './routes/auth/login.tsx'),
    route('register', './routes/auth/register.tsx'),
    route('google/create', './routes/auth/google-create.tsx'),
    route('forgot-password', './routes/auth/forgot-password.tsx'),
    route('reset-password', './routes/auth/reset-password.tsx'),
    route('confirm', './routes/auth/confirm.tsx'),
    ...prefix('2fa', [
      index('./routes/auth/2fa.tsx'),
      route('backup', './routes/auth/2fa-backup.tsx'),
    ]),
  ]),
  ...prefix('user', [route('confirm', './routes/user-confirm.tsx')]),
  layout('./layouts/auth-protected-layout.tsx', [
    layout('./layouts/organization-layout.tsx', [
      index('./routes/root/home.tsx'),
      route('profile', './routes/root/profile.tsx'),
      route('billing', './routes/root/billing.tsx'),
      route('organizations', './routes/root/organizations.tsx'),
      route('logs', './routes/root/logs.tsx'),
    ]),
    ...prefix('organizations', [
      layout('./layouts/organization-protected-layout.tsx', [
        ...prefix(':organizationId', [
          layout('./layouts/dashboard-layout.tsx', [
            index('./routes/dashboard/quick-start.tsx'),
            ...prefix('applications', [
              index('./routes/dashboard/applications.tsx'),
              route(
                ':applicationId/branding',
                './routes/dashboard/branding.tsx',
              ),
            ]),
            route('users', './routes/dashboard/users.tsx'),
            route('roles', './routes/dashboard/roles.tsx'),
            route('webhooks', './routes/dashboard/webhooks.tsx'),
            route('permissions', './routes/dashboard/permissions.tsx'),
            route('api-keys', './routes/dashboard/api-keys.tsx'),
          ]),
        ]),
      ]),
    ]),
  ]),
];

export default routes;
