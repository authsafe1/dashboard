import { Add, Close, MoreHoriz } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import isURL from 'validator/es/lib/isURL';
import {
  Alert,
  GeneralTooltip,
  GrantSelector,
  SecretManager,
} from '../../components';
import constants from '../../config/constants';

interface IApplicationLoaderData {
  id: string;
  name: string;
  grant: string;
  secret: string;
  redirectUri: string;
  createdAt: string;
  updatedAt: string;
}

interface ICreateApplicationProps {
  open: boolean;
  body: {
    name: string;
    redirectUri?: string;
    grant: string;
  };
  validation: { name: boolean; redirectUri: boolean; grant: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
}

interface IDeleteApplicationProps {
  open: boolean;
  loading: boolean;
  name: string;
  handleClose: () => void;
  handleDelete: () => void;
}

interface IMoreMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleCredentialsOpen: () => void;
  handleDeletionOpen: () => void;
}

interface ICredentialsModalProps {
  open: boolean;
  body: { id: string; secret: string };
  handleClose: () => void;
}

const CreateApplication: FC<ICreateApplicationProps> = ({
  open,
  body,
  validation,
  loading,
  handleInputChange,
  handleClose,
  handleSubmit,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Create Application</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="Name"
              fullWidth
              required
              placeholder="e.g. Google"
              error={validation.name}
              helperText={validation.name ? 'Must not be blank' : ''}
              value={body.name}
              onChange={(event) =>
                handleInputChange('name', event.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>
          {body.grant === 'code' ? (
            <Grid>
              <TextField
                label="Redirect URI"
                fullWidth
                required
                type="url"
                autoComplete="url"
                placeholder="e.g. https://oauth2.google.com/callback"
                error={validation.redirectUri}
                helperText={validation.redirectUri ? 'Must be a URL' : ''}
                value={body.redirectUri}
                onChange={(event) =>
                  handleInputChange('redirectUri', event.target.value)
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Grid>
          ) : null}
          <GrantSelector
            defaultValue={body.grant}
            title="Grant"
            onSelect={(grant) => handleInputChange('grant', grant)}
          />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={handleSubmit}
        >
          Create
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const MoreMenu: FC<IMoreMenuProps> = ({
  anchorEl,
  handleCredentialsOpen,
  handleDeletionOpen,
  handleClose,
}) => {
  return (
    <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
      <MenuItem onClick={handleCredentialsOpen}>Credentials</MenuItem>
      <MenuItem sx={{ color: 'error.main' }} onClick={handleDeletionOpen}>
        Delete
      </MenuItem>
    </Menu>
  );
};

const CredentialsModal: FC<ICredentialsModalProps> = ({
  open,
  body,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>Credentials</DialogTitle>
      <IconButton
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 12,
          color: theme.palette.grey[500],
        })}
        aria-label="close"
        onClick={handleClose}
      >
        <Close />
      </IconButton>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <SecretManager
              label="Client ID"
              value={body.id}
              fullWidth
              copyFunc
              visibilityFunc={false}
              rotateFunc={false}
            />
          </Grid>
          <Grid>
            <SecretManager
              label="Client Secret"
              value={body.secret}
              fullWidth
              copyFunc
              visibilityFunc
              rotateFunc={false}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const DeletionModal: FC<IDeleteApplicationProps> = ({
  open,
  loading,
  name,
  handleClose,
  handleDelete,
}) => {
  const [typedName, setTypedName] = useState('');
  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
        setTypedName('');
      }}
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>Delete application?</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          Are you sure you want to delete this application? This is irreversible
          and all associated permissions and logins will be removed.
        </DialogContentText>
        <DialogContentText gutterBottom>
          Enter application name to confirm.
        </DialogContentText>
        <TextField
          size="small"
          fullWidth
          placeholder="e.g. Google"
          value={typedName}
          onChange={(event) => setTypedName(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
            setTypedName('');
          }}
          color="inherit"
        >
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          color="error"
          variant="contained"
          disabled={typedName !== name}
          onClick={handleDelete}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

interface ClientBody {
  name: string;
  redirectUri?: string;
  grant: string;
}

interface MoreOpenState {
  open: HTMLElement | null;
  state: {
    id: string;
    name: string;
    secret: string;
  };
}

const Applications = () => {
  const [addApplication, setAddApplication] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState<MoreOpenState>({
    open: null,
    state: { id: '', name: '', secret: '' },
  });
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [deletionOpen, setDeletionOpen] = useState(false);
  const [body, setBody] = useState<ClientBody>({
    name: '',
    redirectUri: '',
    grant: 'code',
  });
  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });
  const [validation, setValidation] = useState({
    name: false,
    redirectUri: false,
    grant: false,
  });

  const { revalidate } = useRevalidator();

  const loaderData = useLoaderData() as IApplicationLoaderData[];

  const handleCredentialModalClose = () => {
    setCredentialsOpen(false);
    setMoreMenuOpen({
      open: null,
      state: { id: '', name: '', secret: '' },
    });
  };

  const handleDeletionModalOpen = () => {
    setDeletionOpen(true);
  };

  const handleDeletionModalClose = () => {
    setDeletionOpen(false);
  };

  const handleDeleteClient = async (id: string) => {
    setApiResponse({ ...apiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/client/delete/${id}`,
        {
          method: 'DELETE',
          credentials: 'include',
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
          message: 'Deleted client',
        });
        setDeletionOpen(false);
        handleMoreMenuClose();
        revalidate();
      } else {
        constants.fetchError(response.status);
      }
    } catch (error: any) {
      setApiResponse({
        ...apiResponse,
        success: false,
        error: true,
        message: error.message || 'Error deleting client',
      });
    }
  };

  const handleCreateClient = async () => {
    const tempValidation = { ...validation };
    let validationCount = 0;
    if (body.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (
      (body?.redirectUri as string)?.length > 1 &&
      !isURL(body?.redirectUri as string)
    ) {
      tempValidation.redirectUri = true;
      validationCount++;
    }
    if (body.grant.length < 1) {
      tempValidation.grant = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      const tempBody = { ...body };
      if ((body?.redirectUri as string)?.length < 1) {
        tempBody.redirectUri = undefined;
      }
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/client/create`,
          {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(tempBody),
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
            message: 'Created new client',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: true,
          error: false,
          message: error.message || 'Error creating client',
        });
      }
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setValidation({ ...validation, [name]: false });
    setBody({ ...body, [name]: value });
  };

  const handleApplicationModalClose = () => {
    setBody({ ...body, name: '', redirectUri: '', grant: 'code' });
    setAddApplication(false);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuOpen({ ...moreMenuOpen, open: null });
  };

  const handleCredentialModalOpen = () => {
    setCredentialsOpen(true);
    handleMoreMenuClose();
  };

  return (
    <>
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
          revalidate();
          handleApplicationModalClose();
        }}
      />
      <MoreMenu
        anchorEl={moreMenuOpen.open}
        handleCredentialsOpen={handleCredentialModalOpen}
        handleDeletionOpen={handleDeletionModalOpen}
        handleClose={handleMoreMenuClose}
      />
      <CreateApplication
        open={addApplication}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        handleClose={handleApplicationModalClose}
        handleSubmit={handleCreateClient}
        handleInputChange={handleInputChange}
      />
      <CredentialsModal
        open={credentialsOpen}
        handleClose={handleCredentialModalClose}
        body={moreMenuOpen.state}
      />
      <DeletionModal
        open={deletionOpen}
        loading={apiResponse.loading}
        name={moreMenuOpen.state.name}
        handleClose={handleDeletionModalClose}
        handleDelete={() => handleDeleteClient(moreMenuOpen.state.id)}
      />
      <Grid container width="100%" spacing={2} direction="column">
        <Grid container width="100%" justifyContent="space-between">
          <Grid rowSpacing={2}>
            <Typography variant="h4">Applications</Typography>
            <Typography color="textSecondary">
              Setup a new application for AuthSafe authentication.
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => setAddApplication(true)}
            >
              Create Application
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Grid} justifyContent="center" width="100%">
          <Table>
            <TableBody>
              {loaderData.map((value) => (
                <TableRow key={value.id}>
                  <TableCell>{value.name}</TableCell>
                  <TableCell>{`Client ID: ${value.id}`}</TableCell>
                  <TableCell>{`Grant: ${value.grant}`}</TableCell>
                  <TableCell>{`Created At: ${dayjs(value.createdAt).format(
                    'D MMM YYYY',
                  )}`}</TableCell>
                  <TableCell>{`Updated At: ${dayjs(value.updatedAt).format(
                    'D MMM YYYY',
                  )}`}</TableCell>
                  <TableCell>
                    <GeneralTooltip title="More Info" arrow>
                      <IconButton
                        onClick={(event) =>
                          setMoreMenuOpen({
                            ...moreMenuOpen,
                            open: event.currentTarget,
                            state: {
                              id: value.id,
                              name: value.name,
                              secret: value.secret,
                            },
                          })
                        }
                      >
                        <MoreHoriz />
                      </IconButton>
                    </GeneralTooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </>
  );
};

export default Applications;
