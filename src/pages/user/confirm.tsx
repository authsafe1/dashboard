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
import { useEffect, useState } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router';
import { Alert, AuthSafeIcon } from '../../components';
import constants from '../../config/constants';
import { useThemeToggle } from '../../context/ThemeContext';

const UserConfirm = () => {
  const loaderData: any = useLoaderData();

  const [body, setBody] = useState({
    name: '',
    password: '',
  });

  const [error, setError] = useState({
    name: false,
    password: false,
  });

  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { theme } = useThemeToggle();

  const handleConfirmUser = async () => {
    let validationCount = 0;
    const tempError = { name: false, password: false };
    if (!body.name) {
      tempError.name = true;
      validationCount++;
    }
    if (body.password.length < 6) {
      tempError.password = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setError(tempError);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/profile/confirm?token=${queryParams.get('token')}`,
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
            success: true,
            error: false,
            message: 'Invitation accepted',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: false,
          error: true,
          message: error.message || 'Error accepting invitation',
        });
      }
    }
  };

  useEffect(() => {
    if (!queryParams.get('token')) {
      throw new Error('Token missing');
    }
  }, []);

  return (
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
          navigate('/');
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
            handleConfirmUser();
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
              title="Confirm User"
              subheader="Please enter your details to confirm!"
              sx={{ textAlign: 'center' }}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid width="100%">
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={loaderData?.email || undefined}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid width="100%">
                  <TextField
                    label="Name"
                    name="name"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={body.name}
                    error={error.name}
                    helperText={error.name ? 'Must not be blank' : null}
                    onChange={(event) =>
                      setBody({ ...body, name: event.target.value })
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
            </CardContent>
            <CardActions>
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
                    Confirm
                  </LoadingButton>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserConfirm;
