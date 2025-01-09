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
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import { useLoaderData, useRevalidator, useSearchParams } from 'react-router';
import { Alert, GeneralTooltip, SecretManager } from '../components';
import constants from '../config/constants';

interface IApiKeyLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    description: string;
    token: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
  }[];
}

interface ICreateApiKeyProps {
  open: boolean;
  body: { name: string; description: string; expiresAt: Date };
  validation: { name: boolean; expiresAt: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string | Date | undefined) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
}

interface IEditApiKeyProps {
  open: boolean;
  body: { name: string; description: string; expiresAt: Date };
  validation: { name: boolean; expiresAt: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string | Date | undefined) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
}

interface ITokensModalProps {
  open: boolean;
  body: { token: string };
  handleClose: () => void;
}

interface IMoreMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleEditOpen: () => void;
  handleTokenOpen: () => void;
  handleDeletionOpen: () => void;
}

interface IDeleteApplicationProps {
  open: boolean;
  loading: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}

interface MoreOpenState {
  open: HTMLElement | null;
  state: {
    id: string;
    name: string;
    description: string;
    expiresAt: Date;
    token: string;
  };
}

const CreateApiKey: FC<ICreateApiKeyProps> = ({
  open,
  body,
  validation,
  loading,
  handleInputChange,
  handleSubmit,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Create API Key</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="Name"
              fullWidth
              required
              placeholder="e.g. CI/CD token"
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
          <Grid>
            <DateTimePicker
              label="Expires at"
              value={dayjs(body.expiresAt)}
              onChange={(value) =>
                handleInputChange('expiresAt', value?.toDate())
              }
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  placeholder: 'Expiry Date',
                  error: validation.expiresAt,
                  helperText: validation.expiresAt
                    ? 'Expiry date is required'
                    : '',
                },
              }}
            />
          </Grid>
          <Grid>
            <TextField
              label="Description"
              fullWidth
              placeholder="Describe the token's usage"
              value={body.description}
              multiline
              rows={3}
              onChange={(event) =>
                handleInputChange('description', event.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>
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

const EditApiKey: FC<IEditApiKeyProps> = ({
  open,
  body,
  validation,
  loading,
  handleInputChange,
  handleSubmit,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Update API Key</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="Name"
              fullWidth
              required
              placeholder="e.g. CI/CD token"
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
          <Grid>
            <DateTimePicker
              label="Expires at"
              value={dayjs(body.expiresAt)}
              onChange={(value) =>
                handleInputChange('expiresAt', value?.toDate())
              }
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  placeholder: 'Expiry Date',
                  error: validation.expiresAt,
                  helperText: validation.expiresAt
                    ? 'Expiry date is required'
                    : '',
                },
              }}
            />
          </Grid>
          <Grid>
            <TextField
              label="Description"
              fullWidth
              placeholder="Describe the token's usage"
              value={body.description}
              multiline
              rows={3}
              onChange={(event) =>
                handleInputChange('description', event.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>
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
          Update
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const TokensModal: FC<ITokensModalProps> = ({ open, body, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>Token</DialogTitle>
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
              label="Key"
              value={body.token}
              fullWidth
              copyFunc={true}
              visibilityFunc={true}
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
  handleClose,
  handleDelete,
}) => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
      }}
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>Delete API Key?</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          Are you sure you want to delete this API Key? This is irreversible and
          all apps using this will stop working.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
          }}
          color="inherit"
        >
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          color="error"
          variant="contained"
          onClick={handleDelete}
        >
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const MoreMenu: FC<IMoreMenuProps> = ({
  anchorEl,
  handleEditOpen,
  handleTokenOpen,
  handleDeletionOpen,
  handleClose,
}) => {
  return (
    <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
      <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
      <MenuItem onClick={handleTokenOpen}>Token</MenuItem>
      <MenuItem sx={{ color: 'error.main' }} onClick={handleDeletionOpen}>
        Delete
      </MenuItem>
    </Menu>
  );
};

const ApiKeys = () => {
  const [addApiKey, setAddApiKey] = useState(false);
  const [editApiKey, setEditApiKey] = useState(false);
  const [body, setBody] = useState({
    name: '',
    description: '',
    expiresAt: dayjs().add(1, 'hour').toDate(),
  });
  const [moreMenuOpen, setMoreMenuOpen] = useState<MoreOpenState>({
    open: null,
    state: {
      id: '',
      name: '',
      description: '',
      expiresAt: dayjs().add(1, 'hour').toDate(),
      token: '',
    },
  });
  const [tokenOpen, setTokenOpen] = useState(false);
  const [deletionOpen, setDeletionOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });
  const [validation, setValidation] = useState({
    name: false,
    expiresAt: false,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const { revalidate } = useRevalidator();

  const page = useMemo(() => {
    const skip = searchParams.get('skip');
    const take = searchParams.get('take');

    if (skip && take) {
      const skipValue = Number(skip);
      const takeValue = Number(take);

      if (
        Number.isNaN(skipValue) ||
        Number.isNaN(takeValue) ||
        takeValue === 0
      ) {
        return 0;
      }
      return Math.floor(skipValue / takeValue);
    }
    return 0;
  }, [searchParams]);

  const rowsPerPage = useMemo(() => {
    const take = searchParams.get('take');

    if (take) {
      const takeValue = Number(take);
      if (!Number.isNaN(takeValue) && takeValue > 0) {
        return takeValue;
      }
    }
    return 10;
  }, [searchParams]);

  const loaderData = useLoaderData() as IApiKeyLoaderData;

  const handleCreateApiKey = async () => {
    const tempValidation = { ...validation };
    let validationCount = 0;
    if (body.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (
      !dayjs(body.expiresAt).isValid() &&
      !dayjs(body.expiresAt).isAfter(dayjs(), 'day')
    ) {
      tempValidation.expiresAt = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        console.log(body);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api-key/create`,
          {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(body),
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
            message: 'Created new api key',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: false,
          error: true,
          message: error.message || 'Error creating api key',
        });
      }
    }
  };

  const handleEditApiKey = async () => {
    const tempValidation = { ...validation };
    let validationCount = 0;
    if (body.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (
      !dayjs(body.expiresAt).isValid() &&
      !dayjs(body.expiresAt).isAfter(dayjs(), 'day')
    ) {
      tempValidation.expiresAt = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        console.log(body);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api-key/update/${
            moreMenuOpen.state.token
          }`,
          {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(body),
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
            message: 'Updated api key',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: false,
          error: true,
          message: error.message || 'Error updating api key',
        });
      }
    }
  };

  const handleDeleteApiKey = async (token: string) => {
    setApiResponse({ ...apiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api-key/delete/${token}`,
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
          message: 'Deleted API Key',
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
        message: error.message || 'Error deleting API key',
      });
    }
  };

  const handleInputChange = (
    name: string,
    value: string | Date | undefined,
  ) => {
    setValidation({ ...validation, [name]: false });
    setBody({ ...body, [name]: value });
  };

  const handleMoreMenuClose = () => {
    setMoreMenuOpen({ ...moreMenuOpen, open: null });
  };

  const handleEditModalOpen = () => {
    setEditApiKey(true);
    setBody({
      ...body,
      name: moreMenuOpen.state.name,
      description: moreMenuOpen.state.description,
      expiresAt: dayjs(moreMenuOpen.state.expiresAt).toDate(),
    });
    handleMoreMenuClose();
  };

  const handleTokenModalOpen = () => {
    setTokenOpen(true);
    handleMoreMenuClose();
  };

  const handleDeletionModalOpen = () => {
    setDeletionOpen(true);
    handleMoreMenuClose();
  };

  const handleTokenModalClose = () => {
    setTokenOpen(false);
    setMoreMenuOpen({
      open: null,
      state: {
        id: '',
        token: '',
        name: '',
        description: '',
        expiresAt: dayjs().toDate(),
      },
    });
  };

  const handleDeletionModalClose = () => {
    setDeletionOpen(false);
  };

  const handleEditApiKeyModalClose = () => {
    setBody({
      ...body,
      name: '',
      description: '',
      expiresAt: dayjs().add(1, 'hour').toDate(),
    });
    setEditApiKey(false);
  };

  const handleCreateApiKeyModalClose = () => {
    setBody({
      ...body,
      name: '',
      description: '',
      expiresAt: dayjs().add(1, 'hour').toDate(),
    });
    setAddApiKey(false);
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
          handleCreateApiKeyModalClose();
          handleEditApiKeyModalClose();
          handleDeletionModalClose();
        }}
      />
      <MoreMenu
        anchorEl={moreMenuOpen.open}
        handleEditOpen={handleEditModalOpen}
        handleTokenOpen={handleTokenModalOpen}
        handleDeletionOpen={handleDeletionModalOpen}
        handleClose={handleMoreMenuClose}
      />
      <CreateApiKey
        open={addApiKey}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        handleClose={handleCreateApiKeyModalClose}
        handleInputChange={handleInputChange}
        handleSubmit={handleCreateApiKey}
      />
      <EditApiKey
        open={editApiKey}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        handleClose={handleEditApiKeyModalClose}
        handleInputChange={handleInputChange}
        handleSubmit={handleEditApiKey}
      />
      <TokensModal
        open={tokenOpen}
        body={{ token: moreMenuOpen.state.token }}
        handleClose={handleTokenModalClose}
      />
      <DeletionModal
        open={deletionOpen}
        loading={apiResponse.loading}
        handleClose={handleDeletionModalClose}
        handleDelete={() => handleDeleteApiKey(moreMenuOpen.state.token)}
      />
      <Grid container width="100%" spacing={2} direction="column">
        <Grid container width="100%" justifyContent="space-between">
          <Grid rowSpacing={2}>
            <Typography variant="h4">API Keys</Typography>
            <Typography color="textSecondary">
              Manage, secure, and create API keys to control access to your
              applications and services effectively.
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => setAddApiKey(true)}
            >
              Create API Key
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Grid} justifyContent="center" width="100%">
          <Table>
            <TableBody>
              {loaderData &&
                loaderData?.all.map((value) => (
                  <TableRow key={value.id}>
                    <TableCell>
                      <Typography gutterBottom fontWeight="bold">
                        {value.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {value.description}
                      </Typography>
                    </TableCell>
                    <TableCell>{`Created At: ${dayjs(value.createdAt).format(
                      'D MMM YYYY',
                    )}`}</TableCell>
                    <TableCell>{`Updated At: ${dayjs(value.updatedAt).format(
                      'D MMM YYYY',
                    )}`}</TableCell>
                    <TableCell>{`ExpiresAt At: ${dayjs(value.expiresAt).format(
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
                                token: value.token,
                                name: value.name,
                                description: value.description,
                                expiresAt: dayjs(value.expiresAt).toDate(),
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
        {loaderData && loaderData?.count ? (
          <TablePagination
            component="div"
            count={loaderData?.count || 0}
            page={page as number}
            rowsPerPage={rowsPerPage as number}
            onPageChange={(_event, newPage) => {
              const currentParams = Object.fromEntries(searchParams.entries());
              setSearchParams({
                ...currentParams,
                skip: String(newPage * rowsPerPage),
              });
            }}
            onRowsPerPageChange={(event) => {
              const currentParams = Object.fromEntries(searchParams.entries());
              setSearchParams({
                ...currentParams,
                take: event.target.value,
              });
            }}
          />
        ) : null}
      </Grid>
    </>
  );
};

export default ApiKeys;
