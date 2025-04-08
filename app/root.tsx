import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ErrorOutline } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { FC, PropsWithChildren } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from 'react-router';
import { AuthProvider } from '~/context/AuthContext';
import { OrganizationProvider } from '~/context/OrganizationContext';
import { ThemeProvider } from '~/context/ThemeContext';
import type { Route } from './+types/root';

interface IBackButtonProps {
  text: string;
  handleClick: () => void;
}

const StyledBackButton: FC<IBackButtonProps> = ({ text, handleClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={handleClick}
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
      {text}
    </Button>
  );
};

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="title" content="authsafe - Secure Access Management" />
        <meta
          name="description"
          content="Integrate secure authentication to your app in minutes and streamline user onboarding, customized for fast-growing businesses, devs, and agile teams."
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#121212"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="authsafe - Secure Access Management"
        />
        <meta
          property="og:description"
          content="Integrate secure authentication to your app in minutes and streamline user onboarding, customized for fast-growing businesses, devs, and agile teams."
        />
        <meta property="og:url" content="/" />
        <meta property="og:site_name" content="authsafe" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" /> */
        <meta property="og:image" content="/images/opengraph.jpg" />
        <meta property="og:image:alt" content="Authsafe social logo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Authsafe | Secure Tomorrow, Today"
        />
        <meta
          name="twitter:description"
          content="Integrate secure authentication to your app in minutes and streamline user onboarding, customized for fast-growing businesses, devs, and agile teams."
        />
        <meta name="twitter:image:type" content="image/jpeg" />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />
        <meta name="twitter:image" content="/images/opengraph.jpg" />
        <meta property="twitter:image:alt" content="Authsafe twitter logo" /> */
        <link
          rel="icon"
          href="/icons/favicon.svg"
          type="image/svg+xml"
          sizes="any"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/icons/light/favicon.ico"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/light/apple-touch-icon.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/light/favicon-32x32.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/light/favicon-16x16.png"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          type="image/x-icon"
          href="/icons/dark/favicon.ico"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/dark/apple-touch-icon.png"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/dark/favicon-32x32.png"
          media="(prefers-color-scheme: dark)"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/dark/favicon-16x16.png"
          media="(prefers-color-scheme: dark)"
        />
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <title>Dashboard | Authsafe</title>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <OrganizationProvider>
              <AuthProvider>{children}</AuthProvider>
            </OrganizationProvider>
          </LocalizationProvider>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
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
        <StyledBackButton
          text="Back to Dashboard"
          handleClick={() => navigate('/')}
        />
      </Box>
    </Container>
  );
}
