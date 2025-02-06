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
import { FormEventHandler, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import isEmail from 'validator/es/lib/isEmail';
import { Alert, AuthSafeIcon } from '../../components';
import { useAuth } from '../../context/AuthContext';
import { useThemeToggle } from '../../context/ThemeContext';

const ForgotPassword = () => {
  const [body, setBody] = useState({
    email: '',
  });

  const [error, setError] = useState({
    email: false,
  });

  const [apiResponse, setApiResponse] = useState({
    loading: false,
    success: false,
    message: '',
  });

  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const { theme } = useThemeToggle();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/user/');
    }
  }, []);

  const handleForgotPassword: FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    const tempError = { email: false };
    if (!isEmail(body.email)) {
      tempError.email = true;
    }
    setError(tempError);
    if (!tempError.email) {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setApiResponse({
          ...apiResponse,
          success: true,
          message: 'Link sent over email',
        });
      } catch {
        setApiResponse({
          ...apiResponse,
          success: true,
          message: 'Link sent over email',
        });
      }
    }
  };

  return (
    <Box>
      <Alert
        success={apiResponse.success}
        message={apiResponse.message}
        handleClose={() => {
          setApiResponse({
            ...apiResponse,
            loading: false,
            success: false,
            message: '',
          });
          navigate('/auth/login', {
            replace: true,
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
          <form onSubmit={handleForgotPassword}>
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
                title="Forgot Password"
                subheader="Please enter your email to continue!"
                sx={{ textAlign: 'center' }}
              />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid width="100%">
                    <TextField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="new-password"
                      error={error.email}
                      helperText={error.email ? 'Must be a email' : null}
                      value={body.email}
                      onChange={(event) =>
                        setBody({ ...body, email: event.target.value })
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
                      <Button
                        variant="contained"
                        size="large"
                        loading={apiResponse.loading}
                        type="submit"
                      >
                        Submit
                      </Button>
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
                        Back to{' '}
                        <MuiLink component={Link} to="/auth/login">
                          Login
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
    </Box>
  );
};

export default ForgotPassword;
