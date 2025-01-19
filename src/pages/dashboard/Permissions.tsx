import { Add, MoreHoriz } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import { useLoaderData, useRevalidator, useSearchParams } from 'react-router';
import { Alert } from '../../components';
import constants from '../../config/constants';

interface IPermissionLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    key: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

interface IMoreMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleEditOpen: () => void;
  handleDeletionOpen: () => void;
}

interface ICreatePermissionProps {
  open: boolean;
  body: { name: string; key: string; description: string };
  validation: { name: boolean; key: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
}

interface IDeletePermissionProps {
  open: boolean;
  loading: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}

interface IEditPermissionProps {
  open: boolean;
  body: { name: string; description: string };
  validation: { name: boolean; key: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
}

interface MoreOpenState {
  open: HTMLElement | null;
  state: {
    id: string;
    name: string;
    description: string;
  };
}

const EditPermission: FC<IEditPermissionProps> = ({
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
      <DialogTitle>Update Permission</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="Name"
              fullWidth
              required
              placeholder="Enter permission name"
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
            <TextField
              label="Description"
              fullWidth
              placeholder="Enter permission description"
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

const CreatePermission: FC<ICreatePermissionProps> = ({
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
      <DialogTitle>Create Permission</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="Name"
              fullWidth
              required
              placeholder="Enter permission name"
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
            <TextField
              label="Key"
              fullWidth
              required
              placeholder="feature:permission"
              error={validation.key}
              helperText={
                validation.key
                  ? "Key must follow the pattern '[segment1]:[segment2]'"
                  : ''
              }
              value={body.key}
              onChange={(event) => handleInputChange('key', event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">org:</InputAdornment>
                  ),
                },
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>
          <Grid>
            <TextField
              label="Description"
              fullWidth
              placeholder="Enter permission description"
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

const DeletionModal: FC<IDeletePermissionProps> = ({
  open,
  loading,
  handleClose,
  handleDelete,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>Delete permission?</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          Are you sure you want to delete this permission? This is irreversible
          and all roles with this permission will be unlinked.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
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
  handleDeletionOpen,
  handleClose,
}) => {
  return (
    <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
      <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
      <MenuItem sx={{ color: 'error.main' }} onClick={handleDeletionOpen}>
        Delete
      </MenuItem>
    </Menu>
  );
};

const Permissions = () => {
  const [addPermission, setAddPermission] = useState(false);
  const [editPermission, setEditPermission] = useState(false);
  const [deletionOpen, setDeletionOpen] = useState(false);
  const [body, setBody] = useState({
    name: '',
    key: '',
    description: '',
  });
  const [moreMenuOpen, setMoreMenuOpen] = useState<MoreOpenState>({
    open: null,
    state: { id: '', name: '', description: '' },
  });
  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });
  const [validation, setValidation] = useState({
    name: false,
    key: false,
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

  const loaderData = useLoaderData() as IPermissionLoaderData;

  const handleCreatePermission = async () => {
    const tempValidation = { ...validation };
    let validationCount = 0;
    if (body.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (!/^[a-z0-9_]+:[a-z0-9_]+$/.test(body.key)) {
      tempValidation.key = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/permission/create`,
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
            message: 'Created new permission',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          error: true,
          success: false,
          message: error.message || 'Error creating permission',
        });
      }
    }
  };

  const handleEditPermission = async (id: string) => {
    const tempValidation = { ...validation };
    let validationCount = 0;
    if (body.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (!/^[a-z0-9_]+:[a-z0-9_]+$/.test(body.key)) {
      tempValidation.key = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/permission/update/${id}`,
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
            message: 'Updated permission',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          error: true,
          success: false,
          message: error.message || 'Error updating permission',
        });
      }
    }
  };

  const handleDeletePermission = async (id: string) => {
    setApiResponse({ ...apiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/permission/delete/${id}`,
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
          message: 'Deleted permission',
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
        message: error.message || 'Error deleting permission',
      });
    }
  };

  const handleEditPermissionModalOpen = () => {
    setBody({
      ...body,
      name: moreMenuOpen.state.name,
      description: moreMenuOpen.state.description,
    });
    setEditPermission(true);
    handleMoreMenuClose();
  };

  const handleDeletionModalOpen = () => {
    setDeletionOpen(true);
    handleMoreMenuClose();
  };

  const handleInputChange = (name: string, value: string) => {
    setValidation({ ...validation, [name]: false });
    setBody({ ...body, [name]: value });
  };

  const handleMoreMenuClose = () => {
    setMoreMenuOpen({ ...moreMenuOpen, open: null });
  };

  const handleEditPermissionModalClose = () => {
    setBody({ ...body, name: '', key: '', description: '' });
    setEditPermission(false);
  };

  const handleCreatePermissionModalClose = () => {
    setBody({ ...body, name: '', key: '', description: '' });
    setAddPermission(false);
  };

  const handleDeletionModalClose = () => {
    setDeletionOpen(false);
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
          handleCreatePermissionModalClose();
          handleEditPermissionModalClose();
          handleDeletionModalClose();
        }}
      />
      <MoreMenu
        anchorEl={moreMenuOpen.open}
        handleEditOpen={handleEditPermissionModalOpen}
        handleDeletionOpen={handleDeletionModalOpen}
        handleClose={handleMoreMenuClose}
      />
      <CreatePermission
        open={addPermission}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        handleClose={handleCreatePermissionModalClose}
        handleInputChange={handleInputChange}
        handleSubmit={handleCreatePermission}
      />
      <EditPermission
        open={editPermission}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        handleClose={handleEditPermissionModalClose}
        handleInputChange={handleInputChange}
        handleSubmit={() => handleEditPermission(moreMenuOpen.state.id)}
      />
      <DeletionModal
        open={deletionOpen}
        loading={apiResponse.loading}
        handleClose={handleDeletionModalClose}
        handleDelete={() => handleDeletePermission(moreMenuOpen.state.id)}
      />
      <Grid container width="100%" spacing={2} direction="column">
        <Grid container width="100%" justifyContent="space-between">
          <Grid rowSpacing={2}>
            <Typography variant="h4">Permissions</Typography>
            <Typography color="textSecondary">
              Define and manage permissions to control access and privileges
              across your applications.
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => setAddPermission(true)}
            >
              Create Permission
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
                    <TableCell>
                      <Chip label={value.key} />
                    </TableCell>
                    <TableCell>{`Created At: ${dayjs(value.createdAt).format(
                      'D MMM YYYY',
                    )}`}</TableCell>
                    <TableCell>{`Updated At: ${dayjs(value.updatedAt).format(
                      'D MMM YYYY',
                    )}`}</TableCell>
                    <TableCell>
                      <Tooltip title="More Info" arrow>
                        <IconButton
                          onClick={(event) =>
                            setMoreMenuOpen({
                              ...moreMenuOpen,
                              open: event.currentTarget,
                              state: {
                                id: value.id,
                                name: value.name,
                                description: value.description,
                              },
                            })
                          }
                        >
                          <MoreHoriz />
                        </IconButton>
                      </Tooltip>
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

export default Permissions;
