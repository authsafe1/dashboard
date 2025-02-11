import { lazy } from 'react';

const ApiKeys = lazy(() => import('./dashboard/api-keys'));
const Applications = lazy(() => import('./dashboard/applications'));
const AuthConfirm = lazy(() => import('./auth/confirm'));
const ForgotPassword = lazy(() => import('./auth/forgot-password'));
const GoogleCreate = lazy(() => import('./auth/google.create'));
const Login = lazy(() => import('./auth/login'));
const Register = lazy(() => import('./auth/register'));
const ResetPassword = lazy(() => import('./auth/reset-password'));
const TwoFactorBackup = lazy(() => import('./auth/2fa.backup'));
const TwoFactorAuthentication = lazy(() => import('./auth/2fa'));
const Billing = lazy(() => import('./organization/billing'));
const BrandingLogin = lazy(() => import('./dashboard/branding'));
const Insights = lazy(() => import('./organization/insights'));
const ActivityLog = lazy(() => import('./organization/log/activity'));
const AuthorizationLog = lazy(() => import('./organization/log/authorization'));
const SecurityLog = lazy(() => import('./organization/log/security'));
const OAuth2Authorize = lazy(() => import('./dashboard/oauth2/authorize'));
const Permissions = lazy(() => import('./dashboard/permissions'));
const Profile = lazy(() => import('./organization/profile'));
const QuickStart = lazy(() => import('./dashboard/quick-start'));
const Roles = lazy(() => import('./dashboard/roles'));
const UserConfirm = lazy(() => import('./user.confirm'));
const Users = lazy(() => import('./dashboard/users'));
const Webhooks = lazy(() => import('./dashboard/webhooks'));
const Organizations = lazy(() => import('./organization/organizations'));
const Error = lazy(() => import('./error/error'));
const NotFound = lazy(() => import('./error/not-found'));

export {
  ActivityLog,
  ApiKeys,
  Applications,
  AuthConfirm,
  AuthorizationLog,
  Billing,
  BrandingLogin,
  Error,
  ForgotPassword,
  GoogleCreate,
  Insights,
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
  SecurityLog,
  TwoFactorAuthentication,
  TwoFactorBackup,
  UserConfirm,
  Users,
  Webhooks,
};
