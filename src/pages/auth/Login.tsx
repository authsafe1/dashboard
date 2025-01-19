import { Google } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid2 as Grid,
  IconButton,
  Link as MuiLink,
  TextField,
  Typography,
} from '@mui/material';
import { FormEventHandler, Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import isEmail from 'validator/es/lib/isEmail';
import { Alert, AuthSafeIcon, ScreenLoader } from '../../components';
import constants from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { useThemeToggle } from '../../context/ThemeContext';

const Login = () => {
  const [body, setBody] = useState({
    email: '',
    password: '',
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

  const [loading, setLoading] = useState(true);

  const { isAuthenticated, profile, checkAuth } = useAuth();

  const { theme } = useThemeToggle();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
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
          `${import.meta.env.VITE_API_URL}/auth/login`,
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
          if (responseBody.redirectTo2Fa) {
            navigate(`/auth/2fa?email=${body.email}`);
          } else {
            setApiResponse({
              ...apiResponse,
              success: true,
              error: false,
              message: 'Successfully logged in',
            });
          }
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

  const handleGoogleSignIn = () => {
    window.location.replace(`${import.meta.env.VITE_API_URL}/auth/google`);
  };

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated) {
      if (location.state?.from) {
        navigate(location.state.from, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, profile, location, navigate]);

  return loading ? (
    <ScreenLoader />
  ) : (
    <Fragment>
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
          checkAuth();
          if (isAuthenticated) {
            if (location.state?.from) {
              navigate(location.state.from, { replace: true });
            } else {
              navigate('/', { replace: true });
            }
          }
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Box
          sx={{
            flex: '1 1 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            p: 2,
          }}
        >
          <form onSubmit={handleLogin}>
            <Card
              sx={{
                p: 4,
                maxWidth: 500,
                borderRadius: 5,
                boxShadow: `0px 4px 10px rgba(91, 25, 145, 0.2), 0px 1px 5px rgba(0, 0, 0, 0.12), 0px 10px 20px 5px rgba(177, 83, 254, 0.15)`,
              }}
              elevation={5}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <IconButton
                  href={`${import.meta.env.VITE_BASE_URL}`}
                  size="large"
                >
                  <AuthSafeIcon fontSize="large" theme={theme} />
                </IconButton>
              </Box>
              <CardHeader
                title="Welcome Back"
                subheader="Please enter your details to continue!"
                sx={{ textAlign: 'center' }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid container width="100%" justifyContent="center">
                    <Grid>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<Google />}
                        onClick={handleGoogleSignIn}
                      >
                        Google
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid container width="100%">
                    <Grid width="100%">
                      <Divider>or</Divider>
                    </Grid>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid width="100%">
                      <TextField
                        label="Email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="Enter your email"
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
                        placeholder="Enter your password"
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
                        variant="contained"
                        type="submit"
                        loading={apiResponse.loading}
                        size="large"
                      >
                        Login
                      </LoadingButton>
                    </Grid>
                  </Grid>
                  <Grid container width="100%" justifyContent="center">
                    <Grid>
                      <MuiLink
                        component={Link}
                        to="/auth/forgot-password"
                        variant="body2"
                      >
                        Forgot Password?
                      </MuiLink>
                    </Grid>
                  </Grid>
                  <Grid container width="100%">
                    <Grid width="100%">
                      <Divider />
                    </Grid>
                  </Grid>
                  <Grid container width="100%" justifyContent="center">
                    <Grid>
                      <Typography component="span" variant="body2">
                        Don't have an account?{` `}
                        <MuiLink component={Link} to="/auth/register">
                          Register
                        </MuiLink>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </form>
        </Box>
      </Box>
    </Fragment>
  );
};

export default Login;
