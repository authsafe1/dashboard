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
import { FC, useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import isEmail from 'validator/es/lib/isEmail';
import { Alert, AuthSafeIcon, Loader } from '../../../../components';
import constants from '../../../../config/constants';
import { useAuth } from '../../../../context/AuthContext';
import { useThemeToggle } from '../../../../context/ThemeContext';

const GoogleCreate: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [body, setBody] = useState({
    name: '',
    domain: '',
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

  const { isAuthenticated, organization, checkAuth } = useAuth();

  const { theme } = useThemeToggle();

  const handleRegister = async () => {
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
    if (
      !/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g.test(
        body.domain,
      )
    ) {
      tempError.domain = true;
    }
    if (body.password.length < 6) {
      tempError.password = true;
    }
    setError(tempError);
    if (!tempError.email && !tempError.password) {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/organization/google/create`,
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
            message: 'Organization Created',
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
          message: error.message || 'Error creating organization',
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
            handleRegister();
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
              title="Create"
              subheader="Enter Details to create your organization"
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
                    label="Domain"
                    name="domain"
                    error={error.domain}
                    helperText={error.domain ? 'Must be a valid domain' : null}
                    value={body.domain}
                    onChange={(event) =>
                      setBody({ ...body, domain: event.target.value })
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
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    error={error.password}
                    helperText={
                      error.password
                        ? 'Must be a greater than 6 characters'
                        : null
                    }
                    value={body.password}
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default GoogleCreate;
