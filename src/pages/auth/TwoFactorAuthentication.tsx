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
} from '@mui/material';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { FormEventHandler, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { Alert, AuthSafeIcon, ScreenLoader } from '../../components';
import constants from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { useThemeToggle } from '../../context/ThemeContext';

const TwoFactorAuthentication = () => {
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const { loading, checkAuth } = useAuth();

  const { theme } = useThemeToggle();

  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });

  const handleTwoFA: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setApiResponse({ ...apiResponse, loading: true });
    const body = { email: searchParams.get('email'), token: otp };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/2fa/verify`,
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (response.ok) {
        setApiResponse({
          ...apiResponse,
          success: true,
          error: false,
          message: 'Successfully logged in',
        });
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
  };

  return loading ? (
    <ScreenLoader />
  ) : (
    <>
      <Alert
        success={apiResponse.success}
        error={apiResponse.error}
        message={apiResponse.message}
        handleClose={() => {
          if (apiResponse.success) {
            checkAuth();
            if (location.state.from) {
              navigate(location.state.from, { replace: true });
            } else {
              navigate('/', { replace: true });
            }
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
          <form onSubmit={handleTwoFA}>
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
                title="2FA"
                subheader="Enter OTP to continue!"
                sx={{ textAlign: 'center' }}
              />
              <CardContent>
                <MuiOtpInput
                  length={6}
                  autoFocus
                  value={otp}
                  validateChar={(character) => !isNaN(Number(character))}
                  onChange={(value) => setOtp(value)}
                  TextFieldsProps={{ placeholder: '-' }}
                />
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
                      loading={apiResponse.loading}
                      size="large"
                      variant="contained"
                      type="submit"
                    >
                      Submit
                    </LoadingButton>
                  </Grid>
                  <Grid width="100%">
                    <Divider />
                  </Grid>
                  <Grid>
                    <MuiLink
                      component={Link}
                      to="/auth/2fa/backup"
                      variant="body2"
                    >
                      Use Backup code
                    </MuiLink>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default TwoFactorAuthentication;
