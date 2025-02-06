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
  Typography,
} from '@mui/material';
import { FormEventHandler, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Alert, AuthSafeIcon, Password } from '../../components';
import constants from '../../config/constants';
import { useThemeToggle } from '../../context/ThemeContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [body, setBody] = useState({
    password: '',
  });

  const navigate = useNavigate();

  const { theme } = useThemeToggle();

  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });

  const handleResetPassword: FormEventHandler<HTMLFormElement> = async (
    event,
  ) => {
    event.preventDefault();
    const tempError = { password: false };
    if (!constants.passwordRegex.test(body.password)) {
      tempError.password = true;
    }
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
          <form onSubmit={handleResetPassword}>
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
                title="Reset Password"
                subheader="Please reset your password!"
                sx={{ textAlign: 'center' }}
              />
              <CardContent>
                <Grid container>
                  <Grid width="100%">
                    <Password
                      label="New Password"
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
                <Grid
                  container
                  width="100%"
                  justifyContent="center"
                  rowSpacing={3}
                >
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
                  <Grid width="100%">
                    <Divider />
                  </Grid>
                  <Grid>
                    <Typography component="span" variant="body2">
                      Back to?{` `}
                      <MuiLink component={Link} to="/auth/register">
                        Login
                      </MuiLink>
                    </Typography>
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

export default ResetPassword;
