import { Add, MoreHoriz } from '@mui/icons-material';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Link as MuiLink,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import React, { type FC, useMemo, useState } from 'react';
import { useLoaderData, useRevalidator, useSearchParams } from 'react-router';
import isEmail from 'validator/es/lib/isEmail';
import { Alert, Password, RolePicker } from '~/components';
import type { Role } from '~/components/reusable/RolePicker';
import constants from '~/config/constants';
import { fetchPaginatedData } from '~/utils/loaders';
import type { Route } from './+types/users';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/user`,
    +skip,
    +take,
  );
}

interface IUserLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    Role: Role;
  }[];
}

interface IRoleAssignmentProps {
  open: boolean;
  loading: boolean;
  body: { id: string; name: string };
  handleClose: () => void;
  handleAssignRole: (id: string, roleId: string) => void;
}

interface IMoreMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleRoleAssignmentOpen: () => void;
  handleEditOpen: () => void;
  handleDeletionOpen: () => void;
}

interface ICreateUserProps {
  open: boolean;
  body: {
    name: string;
    email: string;
    password?: string;
  };
  validation: { name: boolean; email: boolean; password: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string) => void;
  handleInvite: () => Promise<void>;
  handleCreate: () => Promise<void>;
  handleClose: () => void;
}

interface ICreateBulkUsersProps {
  open: boolean;
  body: {
    name: string;
    email: string;
    password: string;
  }[];
  validation: { name: boolean; email: boolean; password: boolean }[];
  loading: boolean;
  parsedLoading: boolean;
  handleParseFile: (file: File | null) => Promise<void>;
  handleCreate: () => Promise<void>;
  handleClose: () => void;
}

interface IEditUserProps {
  open: boolean;
  body: {
    name: string;
    email: string;
    password?: string;
  };
  validation: { name: boolean; email: boolean; password: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
}

interface IDeleteUserProps {
  open: boolean;
  loading: boolean;
  email: string;
  handleClose: () => void;
  handleDelete: () => void;
}

interface UserBody {
  name: string;
  email: string;
  password?: string;
}

interface MoreOpenState {
  open: HTMLElement | null;
  state: {
    id: string;
    name: string;
    email: string;
  };
}

const DeletionModal: FC<IDeleteUserProps> = ({
  open,
  loading,
  email,
  handleClose,
  handleDelete,
}) => {
  const [typedEmail, setTypedEmail] = useState('');
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>Delete user?</DialogTitle>
      <DialogContent>
        <DialogContentText gutterBottom>
          Are you sure you want to delete this user? This is irreversible and
          all associated roles and permissions would be unlinked
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
        <Button
          loading={loading}
          color="error"
          variant="contained"
          disabled={typedEmail.toLowerCase() !== email}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CreateUser: FC<ICreateUserProps> = ({
  open,
  body,
  validation,
  loading,
  handleInputChange,
  handleInvite,
  handleCreate,
  handleClose,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        {tabValue === 0 ? 'Create User' : 'Invite User'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              aria-label="User Tabs"
            >
              <Tab
                label="Create"
                id="user-tab-create"
                aria-label="create-user-tab"
              />
              <Tab
                label="Invite"
                id="user-tab-invite"
                aria-label="invite-user-tab"
              />
            </Tabs>
          </Grid>
          {tabValue === 0 ? (
            <Grid container spacing={2} width="100%" direction="column">
              <Grid>
                <TextField
                  label="Name"
                  fullWidth
                  required
                  autoComplete="name"
                  placeholder="Enter user's name"
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
                  label="Email"
                  fullWidth
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="Enter user's email"
                  error={validation.email}
                  helperText={validation.email ? 'Must be an email' : ''}
                  value={body.email}
                  onChange={(event) =>
                    handleInputChange('email', event.target.value)
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
              <Grid>
                <Password
                  required={true}
                  fullWidth
                  type="third-party"
                  onChange={(value) => handleInputChange('password', value)}
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container width="100%" direction="column">
              <Grid>
                <TextField
                  label="Email"
                  fullWidth
                  required
                  type="email"
                  autoComplete="email"
                  placeholder="Enter user's email"
                  error={validation.email}
                  helperText={validation.email ? 'Must be an email' : ''}
                  value={body.email}
                  onChange={(event) =>
                    handleInputChange('email', event.target.value)
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
            setTabValue(0);
          }}
          color="inherit"
        >
          Cancel
        </Button>
        {tabValue === 0 ? (
          <Button variant="contained" loading={loading} onClick={handleCreate}>
            Create
          </Button>
        ) : (
          <Button variant="contained" loading={loading} onClick={handleInvite}>
            Invite
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const EditUser: FC<IEditUserProps> = ({
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
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="Name"
              fullWidth
              required
              autoComplete="name"
              placeholder="e.g. John Doe"
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
              label="Email"
              fullWidth
              required
              type="email"
              autoComplete="email"
              placeholder="e.g. john.doe@example.com"
              error={validation.email}
              helperText={validation.email ? 'Must be an email' : ''}
              value={body.email}
              onChange={(event) =>
                handleInputChange('email', event.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>
          <Grid>
            <Password
              required={true}
              fullWidth
              type="third-party"
              onChange={(value) => handleInputChange('password', value)}
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
        <Button variant="contained" loading={loading} onClick={handleSubmit}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AssignRole: FC<IRoleAssignmentProps> = ({
  open,
  loading,
  body,
  handleClose,
  handleAssignRole,
}) => {
  const [role, setRole] = useState<Role | Role[]>();
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Assign Role</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField label="Name" value={body.name} fullWidth />
          </Grid>
          <Grid>
            <RolePicker
              required
              multiple={false}
              onRoleSelect={(role) => setRole(role as any)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          loading={loading}
          variant="contained"
          onClick={() => handleAssignRole(body.id, (role as Role)?.id)}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MoreMenu: FC<IMoreMenuProps> = ({
  anchorEl,
  handleRoleAssignmentOpen,
  handleEditOpen,
  handleDeletionOpen,
  handleClose,
}) => {
  return (
    <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
      <MenuItem onClick={handleRoleAssignmentOpen}>Assign Role</MenuItem>
      <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
      <MenuItem sx={{ color: 'error.main' }} onClick={handleDeletionOpen}>
        Delete
      </MenuItem>
    </Menu>
  );
};

const Users = () => {
  const [addUser, setAddUser] = useState(false);
  const [roleAssignment, setRoleAssignment] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [body, setBody] = useState<UserBody>({
    name: '',
    email: '',
    password: '',
  });
  const [moreMenuOpen, setMoreMenuOpen] = useState<MoreOpenState>({
    open: null,
    state: { id: '', name: '', email: '' },
  });
  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });
  const [validation, setValidation] = useState({
    name: false,
    email: false,
    password: false,
  });

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

  const handleCreateUser = async () => {
    const tempValidation = { ...validation };
    let validationCount = 0;
    if (body.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (body.email.length > 1 && !isEmail(body.email)) {
      tempValidation.email = true;
      validationCount++;
    }
    if (body.password && !constants.passwordRegex.test(body.password)) {
      tempValidation.password = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/create`,
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
            message: 'Created new User',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: false,
          error: true,
          message: error.message || 'Error creating user',
        });
      }
    }
  };

  const handleInviteUser = async () => {
    const tempValidation = { ...validation };
    let validationCount = 0;
    if (body.email.length > 1 && !isEmail(body.email)) {
      tempValidation.email = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/invite`,
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
            message: 'Invitation email sent',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: true,
          error: false,
          message: error.message || 'Error inviting user',
        });
      }
    }
  };

  const handleUpdateUser = async (id: string) => {
    const tempValidation = { ...validation };
    const tempBody = { ...body };
    let validationCount = 0;
    if (body.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (body.email.length > 1 && !isEmail(body.email)) {
      tempValidation.email = true;
      validationCount++;
    }
    if ((body?.password as string)?.length < 1) {
      tempBody.password = undefined;
    } else if (
      body.password &&
      body.password.length > 0 &&
      !constants.passwordRegex.test(body.password)
    ) {
      tempValidation.password = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/update/${id}`,
          {
            method: 'PUT',
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
            message: 'Updated user',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: true,
          error: false,
          message: error.message || 'Error updating user',
        });
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    setApiResponse({ ...apiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/delete/${id}`,
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
          message: 'Deleted user',
        });
      } else {
        constants.fetchError(response.status);
      }
    } catch (error: any) {
      setApiResponse({
        ...apiResponse,
        success: false,
        error: true,
        message: error.message || 'Error deleting user',
      });
    }
  };

  const handleUserRoleAssign = async (id: string, roleId: string) => {
    setApiResponse({ ...apiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/assign/role/${id}`,
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ roleId }),
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
          loading: false,
          message: 'Assigned user role',
        });
      } else {
        constants.fetchError(response.status);
      }
    } catch (error: any) {
      setApiResponse({
        ...apiResponse,
        success: false,
        error: true,
        loading: false,
        message: error.message || 'Error assigning role',
      });
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setValidation({ ...validation, [name]: false });
    setBody({ ...body, [name]: value });
  };

  const handleCreateUserModalClose = () => {
    setBody({ ...body, name: '', email: '', password: '' });
    setValidation({
      ...validation,
      name: false,
      email: false,
      password: false,
    });
    setAddUser(false);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuOpen({ ...moreMenuOpen, open: null });
  };

  const handleEditUserModalOpen = () => {
    setBody({
      ...body,
      name: moreMenuOpen.state.name,
      email: moreMenuOpen.state.email,
      password: '',
    });
    setEditUser(true);
  };

  const handleEditUserModalClose = () => {
    setBody({
      ...body,
      name: '',
      email: '',
      password: '',
    });
    setValidation({
      ...validation,
      name: false,
      email: false,
      password: false,
    });
    setEditUser(false);
  };

  const handleRoleAssignmentOpen = () => {
    setRoleAssignment(true);
  };

  const handleRoleAssignmentClose = () => {
    setRoleAssignment(false);
  };

  const handleDeletionOpen = () => {
    setDeleteUser(true);
  };

  const handleDeletionClose = () => {
    setDeleteUser(false);
  };

  const loaderData = useLoaderData() as IUserLoaderData;

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
          handleCreateUserModalClose();
          handleEditUserModalClose();
          handleDeletionClose();
          handleRoleAssignmentClose();
          handleMoreMenuClose();
        }}
      />
      <CreateUser
        open={addUser}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        handleClose={handleCreateUserModalClose}
        handleCreate={handleCreateUser}
        handleInvite={handleInviteUser}
        handleInputChange={handleInputChange}
      />
      <EditUser
        open={editUser}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        handleClose={handleEditUserModalClose}
        handleSubmit={() => handleUpdateUser(moreMenuOpen.state.id)}
        handleInputChange={handleInputChange}
      />
      <DeletionModal
        open={deleteUser}
        loading={apiResponse.loading}
        email={moreMenuOpen.state.email}
        handleClose={handleDeletionClose}
        handleDelete={() => handleDeleteUser(moreMenuOpen.state.id)}
      />
      <AssignRole
        open={roleAssignment}
        body={{ id: moreMenuOpen.state.id, name: moreMenuOpen.state.name }}
        loading={apiResponse.loading}
        handleClose={handleRoleAssignmentClose}
        handleAssignRole={handleUserRoleAssign}
      />
      <MoreMenu
        anchorEl={moreMenuOpen.open}
        handleRoleAssignmentOpen={handleRoleAssignmentOpen}
        handleEditOpen={handleEditUserModalOpen}
        handleDeletionOpen={handleDeletionOpen}
        handleClose={handleMoreMenuClose}
      />
      <Grid container width="100%" spacing={2} direction="column">
        <Grid container width="100%" justifyContent="space-between">
          <Grid rowSpacing={2}>
            <Typography variant="h4">Users</Typography>
            <Typography color="textSecondary">
              Setup and manage users and identities, including password resets,
              assigning permissions and roles.
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => setAddUser(true)}
            >
              Create User
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Grid} justifyContent="center" width="100%">
          <Table>
            <TableBody>
              {loaderData?.all?.map((value) => (
                <TableRow key={value.id}>
                  <TableCell>{value.name}</TableCell>
                  <TableCell>
                    <MuiLink href={`mailto:${value.email}`} color="textPrimary">
                      {value.email}
                    </MuiLink>
                  </TableCell>
                  {value?.Role ? (
                    <TableCell>{`Role: ${value.Role?.name}`}</TableCell>
                  ) : null}
                  {!value?.isVerified ? (
                    <TableCell>
                      <Chip label="Pending Confirmation" />
                    </TableCell>
                  ) : null}
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
                              email: value.email,
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

export default Users;
