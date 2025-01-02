import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createTheme,
  CssBaseline,
  Divider,
  Grid2 as Grid,
  TextField,
  ThemeProvider,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useLoaderData, useLocation } from 'react-router';
import isEmail from 'validator/es/lib/isEmail';
import { Alert, AuthSafeIcon } from '../components';
import constants from '../config/constants';

const OAuth2Authorize = () => {
  const [body, setBody] = useState({
    email: '',
    password: '',
  });

  const loaderData = useLoaderData() as any;
  const systemTheme = useTheme();

  const newTheme = createTheme({
    palette: {
      mode: loaderData.theme,
      primary: {
        main: loaderData?.primaryColor || systemTheme.palette.primary.main,
      },
    },
  });

  const [error, setError] = useState({
    email: false,
    password: false,
  });

  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const handleAuthorization = async () => {
    const tempError = { email: false, password: false };
    if (!isEmail(body.email)) {
      tempError.email = true;
    }
    if (body.password.length < 6) {
      tempError.password = true;
    }
    setError(tempError);
    if (!tempError.email && !tempError.password) {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/oauth2/authorize?${queryParams.toString()}`,
          {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (response.ok) {
          const responseBody = await response.json();
          setApiResponse({
            ...apiResponse,
            success: true,
            error: false,
            message: 'Successfully logged in',
          });
          window.location.replace(
            `${responseBody.redirect_uri}?code=${responseBody.code}&state=${responseBody.state}`,
          );
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: false,
          error: true,
          message: error.message || 'Error logging in',
        });
      }
    }
  };

  return (
    <ThemeProvider theme={newTheme}>
      <CssBaseline />
      <Box>
        <Alert
          success={apiResponse.success}
          error={apiResponse.error}
          message={apiResponse.message}
          handleClose={() => {
            setApiResponse({
              ...apiResponse,
              loading: false,
              success: false,
              error: false,
            });
          }}
        />
        <Grid
          container
          height="100vh"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundImage: `url(${loaderData.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
          }}
        >
          <Grid>
            <Card
              component="form"
              onSubmit={(event) => {
                event.preventDefault();
                handleAuthorization();
              }}
              elevation={5}
              sx={{
                p: 4,
                maxWidth: 500,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {loaderData?.logo && loaderData?.logo?.length !== 0 ? (
                  <Avatar
                    src={loaderData?.logo}
                    sx={{ width: 50, height: 50 }}
                  />
                ) : null}
              </Box>
              <CardHeader
                title={loaderData ? loaderData?.header : 'Sign In'}
                subheader={
                  loaderData
                    ? loaderData?.subHeader
                    : 'Please enter your details to continue'
                }
                sx={{ textAlign: 'center' }}
              />
              <CardContent>
                <Grid container spacing={3} padding={2}>
                  <Grid width="100%">
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={body.email}
                      error={error.email}
                      helperText={error.email ? 'Must be a email' : null}
                      onChange={(event) =>
                        setBody({ ...body, email: event.target.value })
                      }
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid width="100%">
                    <TextField
                      label="Password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={body.password}
                      error={error.password}
                      helperText={
                        error.password
                          ? 'Must be a greater than 6 characters'
                          : null
                      }
                      onChange={(event) =>
                        setBody({ ...body, password: event.target.value })
                      }
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Grid container width="100%" rowSpacing={3}>
                  <Grid
                    container
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        loading={apiResponse.loading}
                        size="large"
                      >
                        {loaderData ? loaderData?.buttonText : 'Login'}
                      </LoadingButton>
                    </Grid>
                  </Grid>
                  <Grid container width="100%">
                    <Grid width="100%">
                      <Divider />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    width="100%"
                    justifyContent="center"
                    spacing={0.5}
                  >
                    <Grid>
                      <Typography component="span">Secured by</Typography>
                    </Grid>
                    <Grid>
                      <AuthSafeIcon theme={loaderData.theme} />
                    </Grid>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default OAuth2Authorize;
