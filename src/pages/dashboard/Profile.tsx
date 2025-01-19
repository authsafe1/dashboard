import { InfoOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid2 as Grid,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import imageCompression from 'browser-image-compression';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router';
import { Alert, FileUploader, SecretManager } from '../../components';
import constants from '../../config/constants';
import { useAuth } from '../../context/AuthContext';

interface IDeleteOrganizationProps {
  open: boolean;
  loading: boolean;
  email?: string;
  handleClose: () => void;
  handleDelete: () => void;
}

interface ITwoFaProps {
  open: boolean;
  qrcode: string;
  backupCodes: string[];
  handleClose: () => void;
}

const DeletionModal: FC<IDeleteOrganizationProps> = ({
  open,
  loading,
  email,
  handleClose,
  handleDelete,
}) => {
  const [typedEmail, setTypedEmail] = useState('');
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>Delete profile?</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          Are you sure you want to delete your profile? This is irreversible and
          all associated details and data would be removed
        </DialogContentText>
        <TextField
          size="small"
          fullWidth
          placeholder="Enter email to confirm"
          value={typedEmail}
          onChange={(event) => setTypedEmail(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          color="error"
          variant="contained"
          disabled={typedEmail.toLowerCase() !== email}
          onClick={handleDelete}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const TwoFaModal: FC<ITwoFaProps> = ({
  open,
  qrcode,
  backupCodes,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>Enable 2FA</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid width="100%">
            <DialogContentText>
              Scan QR with your authenticator app to continue.
            </DialogContentText>
          </Grid>
          <Grid width="100%" display="flex" justifyContent="center">
            <Box
              display="flex"
              component="img"
              src={qrcode}
              alt="2fa qrcode"
              width={300}
              height={300}
              borderRadius={2}
            />
          </Grid>
          <Grid width="100%">
            <Grid container spacing={1} direction="column">
              <Grid width="100%" display="flex" justifyContent="flex-end">
                <Tooltip title="Recovery codes can be used to bypass 2FA in case the device is lost">
                  <InfoOutlined fontSize="small" />
                </Tooltip>
              </Grid>
              <Grid width="100%">
                <SecretManager
                  label="Recovery codes"
                  multiline
                  minRows={2}
                  maxRows={3}
                  fullWidth
                  copyFunc={true}
                  visibilityFunc={false}
                  value={backupCodes.join(' ')}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Profile = () => {
  const { profile, checkAuth } = useAuth();
  const [deletionOpen, setDeletionOpen] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);
  const [deletionApiResponse, setDeletionApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });
  const [metadataApiResponse, setMetadataApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });
  const [photoApiResponse, setPhotoApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });
  const [twoFaApiResponse, setTwoApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });
  const [apiKeyResponse, setApiKeyResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate();

  const { maxProfilePhotoSize } = constants;

  const handleDeleteProfile = async () => {
    setDeletionApiResponse({ ...deletionApiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/delete`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.ok) {
        setDeletionApiResponse({
          ...deletionApiResponse,
          success: true,
          error: false,
          loading: false,
          message: 'Deleted orgnization',
        });
      } else {
        constants.fetchError(response.status);
      }
    } catch (error: any) {
      setDeletionApiResponse({
        ...deletionApiResponse,
        success: false,
        error: true,
        loading: false,
        message: error.message || 'Error deleting organization',
      });
    }
  };

  const handleEnableTwoFA = async () => {
    setTwoApiResponse({ ...twoFaApiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/2fa/enable`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.ok) {
        setTwoApiResponse({
          ...twoFaApiResponse,
          success: true,
          error: false,
          loading: false,
          message: '2FA enabled',
        });
        const body = await response.json();
        setQrCode(body.qrcode);
        setBackupCodes(body.backupCodes);
        handleQrCodeOpen();
      } else if (response.status === 401) {
        setTwoApiResponse({
          ...twoFaApiResponse,
          success: false,
          error: true,
          loading: false,
          message: 'Not authenticated',
        });
      }
    } catch {
      setTwoApiResponse({
        ...twoFaApiResponse,
        success: false,
        error: true,
        loading: false,
        message: 'Error enabling 2FA',
      });
    }
  };

  const handleDisableTwoFA = async () => {
    setTwoApiResponse({ ...twoFaApiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/2fa/disable`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (response.ok) {
        setTwoApiResponse({
          ...twoFaApiResponse,
          success: true,
          error: false,
          loading: false,
          message: '2FA disabled',
        });
        checkAuth();
      } else if (response.status === 401) {
        setTwoApiResponse({
          ...twoFaApiResponse,
          success: false,
          error: true,
          loading: false,
          message: 'Not authenticated',
        });
      }
    } catch {
      setTwoApiResponse({
        ...twoFaApiResponse,
        success: false,
        error: true,
        loading: false,
        message: 'Error enabling 2FA',
      });
    }
  };

  const resizeImage = async (file: File) => {
    try {
      return await imageCompression(file, {
        maxSizeMB: maxProfilePhotoSize,
        maxWidthOrHeight: 500,
        fileType: 'image/webp',
        useWebWorker: true,
      });
    } catch {
      setPhotoApiResponse({
        ...photoApiResponse,
        error: true,
        message: 'Image resizing failed',
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    const compressedPhoto = (await resizeImage(file)) as File;
    const formData = new FormData();
    formData.append('file', compressedPhoto);
    setPhotoApiResponse({ ...photoApiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/upload/photo`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData,
        },
      );
      if (response.ok) {
        setPhotoApiResponse({
          ...photoApiResponse,
          success: true,
          error: false,
          loading: false,
          message: 'Photo uploaded',
        });
      } else if (response.status === 401) {
        setPhotoApiResponse({
          ...photoApiResponse,
          success: false,
          error: true,
          loading: false,
          message: 'Not authenticated',
        });
      }
    } catch {
      setPhotoApiResponse({
        ...photoApiResponse,
        success: false,
        error: true,
        loading: false,
        message: 'Error uploading photo',
      });
    }
  };

  const handleDeletionOpen = () => {
    setDeletionOpen(true);
  };

  const handleDeletionClose = () => {
    setDeletionOpen(false);
  };

  const handleQrCodeOpen = () => {
    setQrCodeOpen(true);
  };

  const handleQrCodeClose = () => {
    setQrCodeOpen(false);
    setQrCode('');
    checkAuth();
  };

  return (
    <>
      <Alert
        success={metadataApiResponse.success}
        error={metadataApiResponse.error}
        message={metadataApiResponse.message}
        handleClose={() => {
          setMetadataApiResponse({
            ...metadataApiResponse,
            success: false,
            error: false,
          });
          checkAuth();
        }}
      />
      <Alert
        success={apiKeyResponse.success}
        error={apiKeyResponse.error}
        message={apiKeyResponse.message}
        handleClose={() => {
          setApiKeyResponse({
            ...apiKeyResponse,
            success: false,
            error: false,
          });
          checkAuth();
        }}
      />
      <Alert
        success={deletionApiResponse.success}
        error={deletionApiResponse.error}
        message={deletionApiResponse.message}
        handleClose={() => {
          setDeletionApiResponse({
            ...deletionApiResponse,
            success: false,
            error: false,
          });
          checkAuth();
          navigate('/auth/login');
          setDeletionOpen(false);
        }}
      />
      <Alert
        success={photoApiResponse.success}
        error={photoApiResponse.error}
        message={photoApiResponse.message}
        handleClose={() => {
          if (photoApiResponse.error) {
            setPhotoApiResponse({
              ...photoApiResponse,
              success: false,
              error: false,
            });
          } else {
            setPhotoApiResponse({
              ...photoApiResponse,
              success: false,
              error: false,
            });
            checkAuth();
          }
        }}
      />
      <DeletionModal
        open={deletionOpen}
        loading={deletionApiResponse.loading}
        email={profile?.email}
        handleClose={handleDeletionClose}
        handleDelete={handleDeleteProfile}
      />
      <TwoFaModal
        open={qrCodeOpen}
        qrcode={qrCode}
        backupCodes={backupCodes}
        handleClose={handleQrCodeClose}
      />
      <Grid container width="100%" spacing={2} direction="column">
        <Grid>
          <Card variant="outlined">
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
                gap: isMobile ? undefined : 4,
              }}
            >
              <FileUploader
                image={profile?.photo}
                name={profile?.name}
                loading={photoApiResponse.loading}
                onFileSelect={(file) => handleImageUpload(file)}
                sx={{
                  width: 100,
                  height: 100,
                  mr: isMobile ? 0 : 2,
                  mb: isMobile ? 2 : 0,
                }}
              />
              <Grid container spacing={1} flex={1}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" color="textSecondary">
                    Name
                  </Typography>
                  <Typography noWrap>{profile?.name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" color="textSecondary">
                    Email
                  </Typography>
                  <Typography noWrap>{profile?.email}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Divider />
        </Grid>
        <Grid>
          <Card variant="outlined">
            <CardHeader title="Enable Two-Factor Authentication (2FA)" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid>
                  <Typography>
                    Enable 2FA to add an extra layer of security to your
                    account. By activating 2FA, you'll be required to enter a
                    unique verification code, in addition to your password,
                    whenever you log in. This helps protect your account from
                    unauthorized access, ensuring that only you can access your
                    sensitive information.
                  </Typography>
                </Grid>
                <Grid>
                  {profile?.isTwoFactorAuthEnabled ? (
                    <LoadingButton
                      variant="contained"
                      color="error"
                      loading={twoFaApiResponse.loading}
                      onClick={handleDisableTwoFA}
                    >
                      Disable
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      variant="contained"
                      loading={twoFaApiResponse.loading}
                      onClick={handleEnableTwoFA}
                    >
                      Enable
                    </LoadingButton>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card variant="outlined">
            <CardHeader title="Update Password" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid>
                  <Typography>
                    Update your password periodically to strengthen your account
                    security. A strong password not only protects your sensitive
                    information but also reduces the risk of unauthorized
                    access.
                  </Typography>
                </Grid>
                <Grid>
                  <LoadingButton
                    variant="contained"
                    loading={twoFaApiResponse.loading}
                  >
                    Update
                  </LoadingButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card variant="outlined">
            <CardHeader title="Secrets" />
            <CardContent>
              <Grid container width="100%" spacing={2} direction="column">
                <Grid>
                  <SecretManager
                    label="Profile ID"
                    fullWidth
                    value={profile?.id}
                    copyFunc={true}
                    visibilityFunc={true}
                  />
                </Grid>
                <Grid>
                  <SecretManager
                    label="JWKS URL"
                    fullWidth
                    value={`${
                      import.meta.env.VITE_API_URL
                    }/oauth2/.well-known/jwks`}
                    copyFunc={true}
                    visibilityFunc={false}
                  />
                </Grid>
                {/* <Grid>
                  <SecretManager
                    multiline
                    fullWidth
                    label="Public Key"
                    value={Profile?.Secret?.publicKey}
                    copyFunc={true}
                    visibilityFunc={false}
                  />
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card variant="outlined">
            <CardHeader title="Delete Profile" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid>
                  <Typography>
                    Deleting your profile is permanent and cannot be undone. All
                    your data and settings will be removed, and you will no
                    longer be able to access any associated services. Please
                    confirm if you wish to proceed.
                  </Typography>
                </Grid>
                <Grid>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeletionOpen}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
