import { lazy } from 'react';

const ApiKeys = lazy(() => import('./root/ApiKeys'));
const Applications = lazy(() => import('./root/Applications'));
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
const BillingPlan = lazy(() => import('./root/Billing'));
const BrandingLogin = lazy(() => import('./root/branding/BrandingLogin'));
const Insights = lazy(() => import('./organization/Insights'));
const ActivityLog = lazy(() => import('./organization/log/Activity'));
const AuthorizationLog = lazy(() => import('./organization/log/Authorization'));
const SecurityLog = lazy(() => import('./organization/log/Security'));
const OAuth2Authorize = lazy(() => import('./root/OAuth2Authorize'));
const Permissions = lazy(() => import('./root/Permissions'));
const Profile = lazy(() => import('./root/Profile'));
const QuickStart = lazy(() => import('./root/QuickStart'));
const Roles = lazy(() => import('./root/Roles'));
const UserConfirm = lazy(() => import('./root/UserConfirm'));
const Users = lazy(() => import('./root/Users'));
const Webhooks = lazy(() => import('./root/Webhooks'));
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
