import { lazy } from 'react';

const ApiKeys = lazy(() => import('./ApiKeys'));
const Applications = lazy(() => import('./Applications'));
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
const BillingPlan = lazy(() => import('./Billing'));
const BrandingLogin = lazy(() => import('./branding/BrandingLogin'));
const Insights = lazy(() => import('./Insights'));
const ActivityLog = lazy(() => import('./organization/log/Activity'));
const AuthorizationLog = lazy(() => import('./organization/log/Authorization'));
const SecurityLog = lazy(() => import('./organization/log/Security'));
const OAuth2Authorize = lazy(() => import('./OAuth2Authorize'));
const Permissions = lazy(() => import('./Permissions'));
const Profile = lazy(() => import('./Profile'));
const QuickStart = lazy(() => import('./QuickStart'));
const Roles = lazy(() => import('./Roles'));
const UserConfirm = lazy(() => import('./UserConfirm'));
const Users = lazy(() => import('./Users'));
const Webhooks = lazy(() => import('./Webhooks'));
const Organizations = lazy(() => import('./organization/Organizations'));

export {
  ActivityLog,
  ApiKeys,
  Applications,
  AuthConfirm,
  AuthorizationLog,
  BillingPlan,
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
};
