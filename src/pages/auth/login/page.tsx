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
import { FC, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import isEmail from 'validator/es/lib/isEmail';
import { Alert, AuthSafeIcon, Loader } from '../../../components';
import constants from '../../../config/constants';
import { useAuth } from '../../../context/AuthContext';
import { useThemeToggle } from '../../../context/ThemeContext';

const SignIn: FC = () => {
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

  const { isAuthenticated, organization, checkAuth } = useAuth();

  const { theme } = useThemeToggle();

  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = async () => {
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
          `${import.meta.env.VITE_API_URL}/api/auth/login`,
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
    window.location.replace(`${import.meta.env.VITE_API_URL}/api/auth/google`);
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
  }, [isAuthenticated, organization, location, navigate]);

  return loading ? (
    <Loader loading={true} />
  ) : (
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
      <Grid
        container
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            handleSignIn();
          }}
        >
          <Card
            variant="outlined"
            sx={{
              border: (theme) => `2px solid ${theme.palette.primary.main}`,
              p: 4,
              maxWidth: 500,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton onClick={() => navigate('/')} size="large">
                <AuthSafeIcon fontSize="large" theme={theme} />
              </IconButton>
            </Box>
            <CardHeader
              title="Welcome Back"
              subheader="Please enter your details to continue!"
              sx={{ textAlign: 'center' }}
            />
            <CardContent>
              <Grid container rowSpacing={3}>
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
                    <MuiLink component={Link} to="/auth/forgot-password">
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
                    <Typography component="span">
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignIn;
