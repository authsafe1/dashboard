import { lazy } from 'react';

const ApiKeys = lazy(() => import('./dashboard/ApiKeys'));
const Applications = lazy(() => import('./dashboard/Applications'));
const AuthConfirm = lazy(() => import('./auth/AuthConfirm'));
const ForgotPassword = lazy(() => import('./auth/ForgotPassword'));
const GoogleCreate = lazy(() => import('./auth/GoogleCreate'));
const Login = lazy(() => import('./auth/Login'));
const Register = lazy(() => import('./auth/Register'));
const ResetPassword = lazy(() => import('./auth/ResetPassword'));
const TwoFactorBackup = lazy(() => import('./auth/TwoBackup'));
const TwoFactorAuthentication = lazy(
  () => import('./auth/TwoFactorAuthentication'),
);
const BillingPlan = lazy(() => import('./dashboard/Billing'));
const BrandingLogin = lazy(() => import('./dashboard/branding/BrandingLogin'));
const Insights = lazy(() => import('./organization/Insights'));
const ActivityLog = lazy(() => import('./organization/log/Activity'));
const AuthorizationLog = lazy(() => import('./organization/log/Authorization'));
const SecurityLog = lazy(() => import('./organization/log/Security'));
const OAuth2Authorize = lazy(() => import('./dashboard/OAuth2Authorize'));
const Permissions = lazy(() => import('./dashboard/Permissions'));
const Profile = lazy(() => import('./dashboard/Profile'));
const QuickStart = lazy(() => import('./dashboard/QuickStart'));
const Roles = lazy(() => import('./dashboard/Roles'));
const UserConfirm = lazy(() => import('./dashboard/UserConfirm'));
const Users = lazy(() => import('./dashboard/Users'));
const Webhooks = lazy(() => import('./dashboard/Webhooks'));
const Organizations = lazy(() => import('./organization/Organizations'));
const Error = lazy(() => import('./error/error'));
const NotFound = lazy(() => import('./error/not-found'));

export {
  ActivityLog,
  ApiKeys,
  Applications,
  AuthConfirm,
  AuthorizationLog,
  BillingPlan,
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
