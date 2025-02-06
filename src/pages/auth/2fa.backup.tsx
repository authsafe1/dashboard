import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { FormEventHandler, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Alert, AuthSafeIcon, ScreenLoader } from '../../components';
import constants from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { useThemeToggle } from '../../context/ThemeContext';

const TwoFactorBackup = () => {
  const [code, setCode] = useState('');

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

  const handleTwoFABackup: FormEventHandler<HTMLFormElement> = async () => {
    setApiResponse({ ...apiResponse, loading: true });
    const body = { code };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/2fa/backup/verify`,
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
          <form onSubmit={handleTwoFABackup}>
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
                title="2FA Backup"
                subheader="Enter Backup Code to continue!"
                sx={{ textAlign: 'center' }}
              />
              <CardContent>
                <TextField
                  label="Code"
                  fullWidth
                  autoFocus
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                />
              </CardContent>
              <CardActions>
                <Grid container width="100%" justifyContent="center">
                  <Grid>
                    <Button
                      loading={apiResponse.loading}
                      size="large"
                      variant="contained"
                      type="submit"
                    >
                      Submit
                    </Button>
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

export default TwoFactorBackup;
