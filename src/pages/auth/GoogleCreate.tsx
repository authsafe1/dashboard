import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { FormEventHandler, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import isEmail from 'validator/es/lib/isEmail';
import { Alert, AuthSafeIcon, Password, ScreenLoader } from '../../components';
import constants from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { useThemeToggle } from '../../context/ThemeContext';

const GoogleCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [body, setBody] = useState({
    name: '',
    email: searchParams.get('email') || '',
    password: '',
  });

  const [error, setError] = useState({
    name: false,
    domain: false,
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

  const { isAuthenticated, checkAuth } = useAuth();

  const { theme } = useThemeToggle();

  const handleRegister: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const tempError = {
      name: false,
      domain: false,
      email: false,
      password: false,
    };
    if (body.name.length < 1) {
      tempError.name = true;
    }
    if (!isEmail(body.email)) {
      tempError.email = true;
    }
    if (!constants.passwordRegex.test(body.password)) {
      tempError.password = true;
    }
    setError(tempError);
    if (!tempError.email && !tempError.password) {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/profile/google/create`,
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
          setApiResponse({
            ...apiResponse,
            loading: false,
            success: true,
            error: false,
            message: 'Profile Created',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          loading: false,
          success: false,
          error: true,
          message: error.message || 'Error creating profile',
        });
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    if (isAuthenticated) {
      if (
        location.state &&
        location.state.from &&
        location.state.from !== '/'
      ) {
        navigate(location.state.from, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, location, navigate]);

  return loading ? (
    <ScreenLoader />
  ) : (
    <Box>
      <Alert
        success={apiResponse.success}
        error={apiResponse.error}
        message={apiResponse.message}
        handleClose={() => {
          if (apiResponse.success) {
            checkAuth();
            navigate('/', { replace: true });
          }
          setApiResponse({
            ...apiResponse,
            loading: false,
            success: false,
            error: false,
            message: '',
          });
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
          <form onSubmit={handleRegister}>
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
                title="Create"
                subheader="Enter Details to create your profile"
                sx={{ textAlign: 'center' }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid width="100%">
                    <TextField
                      label="Name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      error={error.name}
                      helperText={error.name ? 'Must not be empty' : null}
                      value={body.name}
                      onChange={(event) =>
                        setBody({ ...body, name: event.target.value })
                      }
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid width="100%">
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      value={body.email}
                      disabled
                      fullWidth
                    />
                  </Grid>
                  <Grid width="100%">
                    <Password
                      placeholder="Password"
                      confirmPasswordPlaceholder="Confirm Password"
                      required={true}
                      fullWidth
                      onChange={(value) =>
                        setBody({ ...body, password: value })
                      }
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Grid container width="100%" rowSpacing={5}>
                  <Grid container width="100%" justifyContent="center">
                    <Grid>
                      <LoadingButton
                        variant="contained"
                        size="large"
                        loading={apiResponse.loading}
                        type="submit"
                      >
                        Create
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default GoogleCreate;
