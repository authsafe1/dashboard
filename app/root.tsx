import { CacheProvider } from '@emotion/react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { Box, Button, Container, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState, type FC, type PropsWithChildren } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from 'react-router';
import { AuthProvider } from '~/context/auth-context';
import { OrganizationProvider } from '~/context/organization-context';
import { ThemeProvider } from '~/context/theme-context';
import createEmotionCache from '~/utils/createEmotionCache';
import type { Route } from './+types/root';

export const meta: Route.MetaFunction = () => [
  { title: 'Dashboard | Authsafe' },
  { charSet: 'UTF-8' },
  { name: 'emotion-insertion-point', content: '' },
  { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
  { name: 'title', content: 'authsafe - Secure Access Management' },
  {
    name: 'description',
    content:
      'Integrate secure authentication to your app in minutes and streamline user onboarding, customized for fast-growing businesses, devs, and agile teams.',
  },
  {
    name: 'theme-color',
    media: '(prefers-color-scheme: light)',
    content: '#fff',
  },
  {
    name: 'theme-color',
    media: '(prefers-color-scheme: dark)',
    content: '#121212',
  },
  { property: 'og:type', content: 'website' },
  { property: 'og:title', content: 'authsafe | Secure Tomorrow, Today' },
  {
    property: 'og:description',
    content:
      'Integrate secure authentication to your app in minutes and streamline user onboarding, customized for fast-growing businesses, devs, and agile teams.',
  },
  { property: 'og:url', content: '/' },
  { property: 'og:site_name', content: 'authsafe' },
  { property: 'og:locale', content: 'en_US' },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
  { property: 'og:image:type', content: 'image/jpeg' },
  { property: 'og:image', content: '/images/opengraph.jpg' },
  { property: 'og:image:alt', content: 'Authsafe social logo' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Authsafe | Secure Tomorrow, Today' },
  {
    name: 'twitter:description',
    content:
      'Integrate secure authentication to your app in minutes and streamline user onboarding, customized for fast-growing businesses, devs, and agile teams.',
  },
  { name: 'twitter:image:type', content: 'image/jpeg' },
  { name: 'twitter:image:width', content: '1200' },
  { name: 'twitter:image:height', content: '630' },
  { name: 'twitter:image', content: '/images/opengraph.jpg' },
  { name: 'twitter:image:alt', content: 'Authsafe twitter logo' },
];

export const links: Route.LinksFunction = () => [
  {
    rel: 'icon',
    href: '/icons/favicon.svg',
    type: 'image/svg+xml',
    sizes: 'any',
  },
  {
    rel: 'icon',
    type: 'image/x-icon',
    href: '/icons/light/favicon.ico',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/icons/light/apple-touch-icon.png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/icons/light/favicon-32x32.png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/icons/light/favicon-16x16.png',
    media: '(prefers-color-scheme: light)',
  },
  {
    rel: 'icon',
    type: 'image/x-icon',
    href: '/icons/dark/favicon.ico',
    media: '(prefers-color-scheme: dark)',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/icons/dark/apple-touch-icon.png',
    media: '(prefers-color-scheme: dark)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/icons/dark/favicon-32x32.png',
    media: '(prefers-color-scheme: dark)',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/icons/dark/favicon-16x16.png',
    media: '(prefers-color-scheme: dark)',
  },
];

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [emotionCache] = useState(() => createEmotionCache());

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body suppressHydrationWarning>
        <ScrollRestoration />
        <Scripts />
        <CacheProvider value={emotionCache}>
          <ThemeProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <OrganizationProvider>
                <AuthProvider>{children}</AuthProvider>
              </OrganizationProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </CacheProvider>
      </body>
    </html>
  );
};

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  const navigate = useNavigate();

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 6 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <ErrorOutline color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom color="text.primary">
          {message}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {details}
        </Typography>
        {import.meta.env.DEV && error && error instanceof Error ? (
          <Typography>{stack}</Typography>
        ) : null}
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/')}
          sx={{
            textTransform: 'none',
            px: 3,
            py: 1.5,
            borderRadius: 2,
            backgroundImage: (theme) =>
              `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            '&:hover': {
              backgroundImage: (theme) =>
                `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
}
