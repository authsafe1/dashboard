import { lazy } from 'react';

const Home = lazy(() => import('./root/home'));
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
const Billing = lazy(() => import('./root/billing'));
const BrandingLogin = lazy(() => import('./dashboard/branding'));
const Log = lazy(() => import('../pages/root/logs.tsx'));
const OAuth2Authorize = lazy(() => import('./dashboard/oauth2/authorize'));
const Permissions = lazy(() => import('./dashboard/permissions'));
const Profile = lazy(() => import('./root/profile'));
const QuickStart = lazy(() => import('./dashboard/quick-start'));
const Roles = lazy(() => import('./dashboard/roles'));
const UserConfirm = lazy(() => import('./user.confirm'));
const Users = lazy(() => import('./dashboard/users'));
const Webhooks = lazy(() => import('./dashboard/webhooks'));
const Organizations = lazy(() => import('./root/organizations'));
const Error = lazy(() => import('./error/error'));
const NotFound = lazy(() => import('./error/not-found'));

export {
  ApiKeys,
  Applications,
  AuthConfirm,
  Billing,
  BrandingLogin,
  Error,
  ForgotPassword,
  GoogleCreate,
  Home,
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
};
