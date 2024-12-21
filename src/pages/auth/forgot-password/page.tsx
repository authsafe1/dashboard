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
import { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import isEmail from 'validator/es/lib/isEmail';
import { Alert, AuthSafeIcon } from '../../../components';
import { useAuth } from '../../../context/AuthContext';
import { useThemeToggle } from '../../../context/ThemeContext';

const ForgotPassword: FC = () => {
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

  const handleForgotPassword = async () => {
    const tempError = { email: false };
    if (!isEmail(body.email)) {
      tempError.email = true;
    }
    setError(tempError);
    if (!tempError.email) {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        await fetch(`/api/auth/forgot-password`, {
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
            handleForgotPassword();
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
                    <LoadingButton
                      variant="contained"
                      size="large"
                      loading={apiResponse.loading}
                      type="submit"
                    >
                      Submit
                    </LoadingButton>
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
                      Back to{' '}
                      <MuiLink component={Link} to="/auth/signin">
                        Login
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

export default ForgotPassword;
