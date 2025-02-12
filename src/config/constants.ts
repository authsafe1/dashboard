import {
  AdminPanelSettings,
  Apps,
  Badge,
  BarChart,
  Bolt,
  Brush,
  Business,
  CreditCard,
  GroupAdd,
  History,
  IntegrationInstructions,
  Key,
  Laptop,
  Link,
  LockPerson,
  Person,
  PersonAdd,
  Shield,
  Storage,
  Timeline,
  Verified,
  Webhook,
} from '@mui/icons-material';

export default {
  steps: [
    {
      title: 'Sign Up',
      description: 'Create an account and set up your organization in minutes.',
      Icon: PersonAdd,
    },
    {
      title: 'Create Users and Applications',
      description:
        'Add users to your organization and register client applications to enable SSO authentication using OIDC.',
      Icon: GroupAdd,
    },
    {
      title: 'Customize Branding',
      description:
        'Customize the branding for your organization, including login page and user interfaces, to match your corporate identity.',
      Icon: Brush,
    },
    {
      title: 'Configure Permissions',
      description:
        'Create granular permissions for users and collate them into roles to efficiently manage access control across your organization.',
      Icon: AdminPanelSettings,
    },
    {
      title: 'Assign Roles',
      description:
        'Assign roles to users, allowing for a structured approach to access control with pre-defined or custom roles.',
      Icon: Badge,
    },
    {
      title: 'Integrate Authentication',
      description:
        'Integrate AuthSafe into your application using OIDC for seamless sign-in, enabling single sign-on (SSO) for your users.',
      Icon: IntegrationInstructions,
    },
    {
      title: 'Monitor Usage',
      description:
        'Track user activity, log events, and manage sessions with real-time insights to ensure compliance and security.',
      Icon: Timeline,
    },
    {
      title: 'Audit Logs',
      description:
        'Review detailed audit logs for security and compliance purposes, including login attempts, permission changes, and more.',
      Icon: History,
    },
    {
      title: 'Manage Security',
      description:
        'Enhance security by configuring multi-factor authentication (MFA) and monitoring potential threats.',
      Icon: Shield,
    },
    {
      title: 'Seamless Integration',
      description:
        'Easily integrate with other services and applications within your ecosystem to centralize your authentication and authorization flow.',
      Icon: Link,
    },
  ],
  dashboardNavigation: (id?: string) => [
    {
      subheader: 'Overview',
      routes: [{ to: `/organizations/${id}`, text: 'Quick Start', Icon: Bolt }],
    },
    {
      subheader: 'Users and Applications',
      routes: [
        {
          to: `/organizations/${id}/users?skip=0&take=10`,
          text: 'Users',
          Icon: Person,
        },
        {
          to: `/organizations/${id}/applications?skip=0&take=10`,
          text: 'Applications',
          Icon: Apps,
        },
      ],
    },
    {
      subheader: 'Access Management',
      routes: [
        {
          to: `/organizations/${id}/roles?skip=0&take=10`,
          text: 'Roles',
          Icon: Badge,
        },
        {
          to: `/organizations/${id}/permissions?skip=0&take=10`,
          text: 'Permissions',
          Icon: Verified,
        },
      ],
    },
    {
      subheader: 'Developers',
      routes: [
        {
          to: `/organizations/${id}/webhooks?skip=0&take=1`,
          text: 'Webhooks',
          Icon: Webhook,
        },
        {
          to: `/organizations/${id}/api-keys?skip=0&take=10`,
          text: 'API Keys',
          Icon: Key,
        },
      ],
    },
  ],
  organizationNavigation: [
    { to: '/', text: 'Insights', Icon: BarChart },
    {
      to: '/organizations?skip=0&take=10',
      text: 'Organizations',
      Icon: Business,
    },
    {
      to: '/billing',
      text: 'Billing',
      Icon: CreditCard,
    },
    {
      to: '/log/activity?skip=0&take=10',
      text: 'Activity Logs',
      Icon: History,
    },
    {
      to: '/log/authorization?skip=0&take=10',
      text: 'Authorization Logs',
      Icon: LockPerson,
    },
    {
      to: '/log/security?skip=0&take=10',
      text: 'Security Logs',
      Icon: Shield,
    },
  ],
  billingTiers: {
    FREE: {
      price: '₹0',
      features: [
        '10,000 monthly active users',
        '100 permission and 10 roles',
        'Email-password authentication',
        'Community support',
      ],
    },
    PROFESSIONAL: {
      price: '₹799',
      features: [
        'Up to 100,000 users',
        'Social login integration',
        '1000 permissions and 100 roles',
        'Remove AuthSafe branding',
        'Email support with 24-hour response',
      ],
    },
    ENTERPRISE: {
      price: '₹4,999',
      features: [
        'Unlimited users',
        'SSO support',
        'Unlimited roles and permissions',
        '24/7 priority support',
      ],
    },
  },
  grants: [
    {
      Icon: Laptop,
      title: 'Third Party Applications',
      description: 'Mobile/Desktop app, SPA and web applications',
      value: 'code',
    },
    {
      Icon: Storage,
      title: 'First Party Applications',
      description: 'CLI, daemons and cron jobs for uninterrupted processes',
      value: 'client-credentials',
    },
  ],
  gettingStartedSteps: [
    'Create User',
    'Create Application',
    'Create Permission',
    'Create Role',
  ],
  eventCatalog: [
    'organization.created',
    'organization.verified',
    'organization.updated',
    'organization.deleted',
    'organization.photo.updated',
    'user.invited',
    'user.created',
    'user.updated',
    'user.role.assigned',
    'user.deleted',
    'application.created',
    'application.updated',
    'application.deleted',
    'permission.created',
    'permission.updated',
    'permission.deleted',
    'role.created',
    'role.updated',
    'role.deleted',
  ],
  fetchError: (status: number) => {
    switch (status) {
      case 400:
        throw new Error(
          `Bad Request: The server could not understand the request.`,
        );
      case 401:
        throw new Error(
          `Unauthorized: Access is denied due to invalid credentials.`,
        );
      case 403:
        throw new Error(
          `Forbidden: You do not have permission to access this resource.`,
        );
      case 404:
        throw new Error(
          `Not Found: The requested resource could not be found.`,
        );
      case 500:
        throw new Error(
          `Internal Server Error: The server encountered an issue.`,
        );
      case 503:
        throw new Error(
          `Service Unavailable: The server is not ready to handle the request.`,
        );
      default:
        throw new Error(`Unexpected Error: Unknown Error`);
    }
  },
  loadScript: (src: string) => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },
  unverifiedUserMessage: {
    title: 'Warning! Unverified user',
    subtitle:
      'Please verify your email within 10 days to avoid account deletion.',
  },
  passwordRegex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@#!$%^&-])(?=.*\d).{8,}$/,
  maxProfilePhotoSize: 0.2,
};
