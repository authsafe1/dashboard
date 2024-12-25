import { LoadingButton } from '@mui/lab';
import {
  Box,
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
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Alert, AuthSafeIcon } from '../../components';
import constants from '../../config/constants';
import { useThemeToggle } from '../../context/ThemeContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [body, setBody] = useState({
    password: '',
  });

  const navigate = useNavigate();

  const [error, setError] = useState({
    password: false,
  });

  const { theme } = useThemeToggle();

  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });

  const handleResetPassword = async () => {
    const tempError = { password: false };
    if (body.password.length < 6) {
      tempError.password = true;
    }
    setError(tempError);
    if (!tempError.password) {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/reset-password`,
          {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({ ...body, token: searchParams.get('token') }),
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
            message: 'Password reset successfully',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: true,
          error: false,
          message: error.message || 'Some error has occured',
        });
      }
    }
  };

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
          navigate('/auth/signin', {
            replace: true,
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
            handleResetPassword();
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
              title="Reset Password"
              subheader="Please reset your password!"
              sx={{ textAlign: 'center' }}
            />
            <CardContent>
              <Grid container>
                <Grid width="100%">
                  <TextField
                    label="New Password"
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
              <Grid
                container
                width="100%"
                justifyContent="center"
                rowSpacing={3}
              >
                <Grid>
                  <LoadingButton
                    variant="contained"
                    size="large"
                    loading={apiResponse.loading}
                    type="submit"
                  >
                    Submit
                  </LoadingButton>
                </Grid>
                <Grid width="100%">
                  <Divider />
                </Grid>
                <Grid>
                  <Typography component="span">
                    Back to?{` `}
                    <MuiLink component={Link} to="/auth/register">
                      Login
                    </MuiLink>
                  </Typography>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResetPassword;
