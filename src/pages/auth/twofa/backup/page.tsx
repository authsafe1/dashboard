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
import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Alert, AuthSafeIcon, Loader } from '../../../../components';
import constants from '../../../../config/constants';
import { useAuth } from '../../../../context/AuthContext';
import { useThemeToggle } from '../../../../context/ThemeContext';

const TwoFactorBackup: FC = () => {
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

  const handleTwoFABackup = async () => {
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
    <Loader loading={true} />
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
            handleTwoFABackup();
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
                  <LoadingButton
                    loading={apiResponse.loading}
                    size="large"
                    variant="contained"
                    type="submit"
                  >
                    Submit
                  </LoadingButton>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default TwoFactorBackup;
