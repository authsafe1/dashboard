import { InfoOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardActions,
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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import imageCompression from 'browser-image-compression';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Alert,
  FileUploader,
  GeneralTooltip,
  MetadataTable,
  SecretManager,
} from '../components';
import constants from '../config/constants';
import { useAuth } from '../context/AuthContext';

interface KeyValue {
  key: string;
  value: string;
}

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
      <DialogTitle sx={{ m: 0, p: 2 }}>Delete organization?</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          Are you sure you want to delete your organization? This is
          irreversible and all associated settings and data would be removed
        </DialogContentText>
        <DialogContentText gutterBottom>
          Enter email to confirm.
        </DialogContentText>
        <TextField
          size="small"
          fullWidth
          placeholder="e.g. john.doe@gmail.com"
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
                <GeneralTooltip
                  arrow
                  title="Recovery codes can be used to bypass 2FA in case the device is lost"
                >
                  <InfoOutlined fontSize="small" />
                </GeneralTooltip>
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
  const { organization, checkAuth } = useAuth();

  const [metadata, setMetadata] = useState<KeyValue[]>([]);
  const [isMetadataEditable, setIsMetadataEditable] = useState(false);
  const [metadataErrors, setMetadataErrors] = useState<{
    [index: number]: { key?: boolean; value?: boolean; message?: string };
  }>({});
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

  const parseMetadata = (metadata?: object): KeyValue[] => {
    return Object.entries(metadata as object).map(([key, value]) => ({
      key,
      value: value as string,
    }));
  };

  const metadataToObject = (parsedMetadata: KeyValue[]) => {
    let tempObject = {};
    parsedMetadata.forEach(({ key, value }) => {
      tempObject = { ...tempObject, [key]: value };
    });
    return tempObject;
  };

  useEffect(() => {
    setMetadata(parseMetadata(organization?.metadata));
  }, [organization?.metadata]);

  const handleMetadataChange = (value: KeyValue[]) => {
    setMetadata(value);
  };

  const handleMetadataEdit = () => {
    setIsMetadataEditable(true);
  };

  const handleMetadataCancel = () => {
    setIsMetadataEditable(false);
    setMetadata(parseMetadata(organization?.metadata));
    setMetadataErrors({});
  };

  const handleMetadataUpdate = async () => {
    const newErrors: {
      [index: number]: { key?: boolean; value?: boolean; message?: string };
    } = {};
    const keysSet = new Set();

    metadata.forEach((item, index) => {
      if (!item.key.trim()) {
        newErrors[index] = {
          ...newErrors[index],
          key: true,
          message: 'Key is required',
        };
      } else if (keysSet.has(item.key)) {
        newErrors[index] = {
          ...newErrors[index],
          key: true,
          message: 'Key must be unique',
        };
      } else {
        keysSet.add(item.key);
      }

      if (!item.value.trim()) {
        newErrors[index] = {
          ...newErrors[index],
          value: true,
          message: 'Value is required',
        };
      }
    });

    if (Object.keys(newErrors).length === 0) {
      const metadataObject = { metadata: metadataToObject(metadata) };
      setMetadataApiResponse({ ...metadataApiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/organization/update`,
          {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(metadataObject),
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (response.ok) {
          setMetadataApiResponse({
            ...metadataApiResponse,
            success: true,
            error: false,
            loading: false,
            message: 'Updated metadata',
          });
          setIsMetadataEditable(false);
          setMetadataErrors({});
        } else if (response.status === 401) {
          setMetadataApiResponse({
            ...metadataApiResponse,
            success: false,
            error: true,
            loading: false,
            message: 'Not authenticated',
          });
        }
      } catch {
        setMetadataApiResponse({
          ...metadataApiResponse,
          success: false,
          error: true,
          loading: false,
          message: 'Error updating metadata',
        });
      }
    } else {
      setMetadataErrors(newErrors);
    }
  };

  const handleDeleteOrganization = async () => {
    setDeletionApiResponse({ ...deletionApiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/organization/delete`,
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

  // const handleRotateApiKey = async () => {
  //   try {
  //     const response = await fetch(
  //       `${import.meta.env.VITE_API_URL}/organization/secret/rotate`,
  //       {
  //         method: 'PUT',
  //         credentials: 'include',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );
  //     if (response.ok) {
  //       setApiKeyResponse({
  //         ...apiKeyResponse,
  //         success: true,
  //         error: false,
  //         loading: false,
  //         message: 'API Key Rotated',
  //       });
  //       checkAuth();
  //     } else {
  //       constants.fetchError(response.status);
  //     }
  //   } catch (error: any) {
  //     setApiKeyResponse({
  //       ...apiKeyResponse,
  //       success: false,
  //       error: true,
  //       loading: false,
  //       message: error.message || 'Error rotating secret',
  //     });
  //   }
  // };

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
        email={organization?.email}
        handleClose={handleDeletionClose}
        handleDelete={handleDeleteOrganization}
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
                image={organization?.photo}
                name={organization?.name}
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
                  <Typography noWrap>{organization?.name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" color="textSecondary">
                    Email
                  </Typography>
                  <Typography noWrap>{organization?.email}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" color="textSecondary">
                    Domain
                  </Typography>
                  <Typography noWrap>{organization?.domain}</Typography>
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
            <CardHeader title="Metadata" />
            <CardContent>
              <MetadataTable
                isEdit={isMetadataEditable}
                metadata={metadata}
                errors={metadataErrors}
                onMetadataChange={handleMetadataChange}
              />
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              {isMetadataEditable ? (
                <>
                  <Button color="inherit" onClick={handleMetadataCancel}>
                    Cancel
                  </Button>
                  <LoadingButton
                    loading={metadataApiResponse.loading}
                    variant="contained"
                    onClick={handleMetadataUpdate}
                  >
                    Update
                  </LoadingButton>
                </>
              ) : (
                <Button variant="contained" onClick={handleMetadataEdit}>
                  Edit
                </Button>
              )}
            </CardActions>
          </Card>
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
                  {organization?.isTwoFactorAuthEnabled ? (
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
            <CardHeader title="Secrets" />
            <CardContent>
              <Grid container width="100%" spacing={2} direction="column">
                <Grid>
                  <SecretManager
                    label="Organization ID"
                    fullWidth
                    value={organization?.id}
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
                <Grid>
                  <SecretManager
                    multiline
                    fullWidth
                    label="Public Key"
                    value={organization?.Secret?.publicKey}
                    copyFunc={true}
                    visibilityFunc={false}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card variant="outlined">
            <CardHeader title="Delete Organization" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid>
                  <Typography>
                    Deleting your organization account is permanent and cannot
                    be undone. All your data and settings will be removed, and
                    you will no longer be able to access any associated
                    services. Please confirm if you wish to proceed.
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
