import { Add, ArrowForward, MoreVert } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import {
  useLoaderData,
  useNavigate,
  useRevalidator,
  useSearchParams,
} from 'react-router';
import { Alert, MetadataTable } from '../../components';
import constants from '../../config/constants';
import { useOrganization } from '../../context/OrganizationContext';

interface IOrganizationLoaderData {
  count: number;
  all: {
    id: string;
    name: string;
    domain: string;
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

type KeyValue = {
  key: string;
  value: string;
};

type MetadataError = {
  [index: number]: { key?: boolean; value?: boolean; message?: string };
};

interface ICreateOrganizationProps {
  open: boolean;
  body: {
    name: string;
    domain: string;
  };
  validation: { name: boolean; domain: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string) => void;
  handleCreate: () => Promise<void>;
  handleClose: () => void;
}

interface IEditOrganizationProps {
  open: boolean;
  body: {
    name: string;
    domain: string;
  };
  validation: { name: boolean; domain: boolean };
  loading: boolean;
  isEdit: boolean;
  metadata: KeyValue[];
  errors: MetadataError;
  onMetadataChange: (updatedMetadata: KeyValue[]) => void;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
}

interface IDeleteOrganizationProps {
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
    domain: string;
  };
}

const DeletionModal: FC<IDeleteOrganizationProps> = ({
  open,
  loading,
  handleClose,
  handleDelete,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>Delete Organization?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this organization? This is
          irreversible and all associated users, applications, roles and
          permissions would be deleted.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          loading={loading}
          color="error"
          variant="contained"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CreateOrganization: FC<ICreateOrganizationProps> = ({
  open,
  body,
  validation,
  loading,
  handleInputChange,
  handleCreate,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Create Organization</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="Name"
              fullWidth
              required
              autoComplete="name"
              placeholder="Enter organization name"
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
              label="Domain"
              fullWidth
              required
              placeholder="Enter organization domain"
              error={validation.domain}
              helperText={validation.domain ? 'Must be a domain' : ''}
              value={body.domain}
              onChange={(event) =>
                handleInputChange('domain', event.target.value)
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
        <Button variant="contained" loading={loading} onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const EditOrganization: FC<IEditOrganizationProps> = ({
  open,
  body,
  validation,
  loading,
  isEdit,
  metadata,
  errors,
  onMetadataChange,
  handleInputChange,
  handleSubmit,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Update Organization</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="Name"
              fullWidth
              required
              autoComplete="name"
              placeholder="Enter organization name"
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
              label="Domain"
              fullWidth
              required
              placeholder="Enter organization domain"
              error={validation.domain}
              helperText={validation.domain ? 'Must be a domain' : ''}
              value={body.domain}
              onChange={(event) =>
                handleInputChange('domain', event.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>
          <Grid>
            <Typography>Metadata</Typography>
            <MetadataTable
              isEdit={isEdit}
              metadata={metadata}
              errors={errors}
              onMetadataChange={onMetadataChange}
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

const Organizations = () => {
  const [addUser, setAddUser] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState(false);
  const [metadata, setMetadata] = useState<KeyValue[]>([]);
  const [isMetadataEditable, setIsMetadataEditable] = useState(false);
  const [metadataErrors, setMetadataErrors] = useState<{
    [index: number]: { key?: boolean; value?: boolean; message?: string };
  }>({});
  const [searchParams, setSearchParams] = useSearchParams();

  const [body, setBody] = useState({
    name: '',
    domain: '',
    metadata: {},
  });
  const [moreMenuOpen, setMoreMenuOpen] = useState<MoreOpenState>({
    open: null,
    state: { id: '', name: '', domain: '' },
  });
  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });
  const [validation, setValidation] = useState({
    name: false,
    domain: false,
  });

  const { revalidate } = useRevalidator();

  const { changeOrganization } = useOrganization();

  const navigate = useNavigate();

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
        return 1;
      }

      return Math.floor(skipValue / takeValue) + 1;
    }

    return 1;
  }, [searchParams]);

  const rowsPerPage = useMemo(() => {
    const take = searchParams.get('take');
    const takeValue = Number(take);

    if (!Number.isNaN(takeValue) && takeValue > 0) {
      return Math.min(takeValue, 100);
    }
    return 10;
  }, [searchParams]);

  const handleMetadataUpdate = () => {
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
      return metadataObject;
    } else {
      setMetadataErrors(() => newErrors);
    }
  };

  const handleCreateOrganization = async () => {
    const tempValidation = { ...validation };
    let validationCount = 0;
    if (body.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (
      body.domain.length > 1 &&
      !/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g.test(
        body.domain,
      )
    ) {
      tempValidation.domain = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/organization/create`,
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
            message: 'Created new organization',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: false,
          error: true,
          message: error.message || 'Error creating organization',
        });
      }
    }
  };

  const handleUpdateOrganization = async (id: string) => {
    const tempValidation = { ...validation };
    const tempBody = { ...body };
    let validationCount = 0;
    const metadata = handleMetadataUpdate();
    if (metadata) {
      tempBody.metadata = metadata.metadata;
    }
    if (body.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (
      body.domain.length > 1 &&
      !/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g.test(
        body.domain,
      )
    ) {
      tempValidation.domain = true;
      validationCount++;
    }
    if (Object.keys(metadataErrors).length > 0) {
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/organization/update/${id}`,
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
            message: 'Updated organization',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: true,
          error: false,
          message: error.message || 'Error updating organization',
        });
      }
    }
  };

  const handleDeleteOrganization = async (id: string) => {
    setApiResponse({ ...apiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/organization/delete/${id}`,
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
          message: 'Deleted organization',
        });
      } else {
        constants.fetchError(response.status);
      }
    } catch (error: any) {
      setApiResponse({
        ...apiResponse,
        success: false,
        error: true,
        message: error.message || 'Error deleting organization',
      });
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setValidation({ ...validation, [name]: false });
    setBody({ ...body, [name]: value });
  };

  const { organization } = useOrganization();

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

  const handleMetadataChange = (value: KeyValue[]) => {
    setMetadata(value);
  };

  const handleCreateOrganizationModalClose = () => {
    setBody({ ...body, name: '', domain: '' });
    setValidation({
      ...validation,
      name: false,
      domain: false,
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
      domain: moreMenuOpen.state.domain,
    });
    setIsMetadataEditable(true);
    setMetadata(parseMetadata(organization?.metadata));
    setEditUser(true);
  };

  const handleEditOrganizationModalClose = () => {
    setBody({
      ...body,
      name: '',
      domain: '',
    });
    setValidation({
      ...validation,
      name: false,
      domain: false,
    });
    setEditUser(false);
    setIsMetadataEditable(false);
    setMetadata(parseMetadata(organization?.metadata));
    setMetadataErrors({});
  };

  const handleDeletionOpen = () => {
    setDeleteUser(true);
  };

  const handleDeletionClose = () => {
    setDeleteUser(false);
  };

  const loaderData = useLoaderData() as IOrganizationLoaderData;

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
          handleCreateOrganizationModalClose();
          handleEditOrganizationModalClose();
          handleDeletionClose();
          handleMoreMenuClose();
        }}
      />
      <CreateOrganization
        open={addUser}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        handleClose={handleCreateOrganizationModalClose}
        handleCreate={handleCreateOrganization}
        handleInputChange={handleInputChange}
      />
      <EditOrganization
        open={editUser}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        isEdit={isMetadataEditable}
        metadata={metadata}
        errors={metadataErrors}
        onMetadataChange={handleMetadataChange}
        handleClose={handleEditOrganizationModalClose}
        handleSubmit={() => handleUpdateOrganization(moreMenuOpen.state.id)}
        handleInputChange={handleInputChange}
      />
      <DeletionModal
        open={deleteUser}
        loading={apiResponse.loading}
        handleClose={handleDeletionClose}
        handleDelete={() => handleDeleteOrganization(moreMenuOpen.state.id)}
      />
      <MoreMenu
        anchorEl={moreMenuOpen.open}
        handleEditOpen={handleEditUserModalOpen}
        handleDeletionOpen={handleDeletionOpen}
        handleClose={handleMoreMenuClose}
      />
      <Grid container width="100%" spacing={2} direction="column">
        <Grid container width="100%">
          <Grid rowSpacing={2}>
            <Typography variant="h4">Organizations</Typography>
            <Typography color="textSecondary">
              Setup and manage organizations, each one comprises of it's own set
              of users, applications, roles and permissions.
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Card
              sx={{ height: '100%', borderStyle: 'dotted', minHeight: 200 }}
              variant="outlined"
            >
              <CardActionArea
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}
                onClick={() => setAddUser(true)}
              >
                <CardContent
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <Add />
                  <Typography>Create Organization</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          {loaderData &&
            loaderData?.all &&
            loaderData.all.map((value) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={value.id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    minHeight: 200,
                  }}
                  variant="outlined"
                >
                  <CardHeader
                    title={value.name}
                    subheader={value.domain}
                    action={
                      <Tooltip title="More Info">
                        <IconButton
                          onClick={(event) =>
                            setMoreMenuOpen({
                              ...moreMenuOpen,
                              open: event.currentTarget,
                              state: {
                                id: value.id,
                                name: value.name,
                                domain: value.domain,
                              },
                            })
                          }
                        >
                          <MoreVert />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <CardContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <Typography>{`ID ${value.id}`}</Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {`Updated ${dayjs(value.updatedAt).diff(
                        Date.now(),
                        'days',
                      )} days ago`}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      {`Created ${dayjs(value.createdAt).diff(
                        Date.now(),
                        'days',
                      )} days ago`}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ display: 'flex', justifyContent: 'flex-end' }}
                  >
                    <Button
                      endIcon={<ArrowForward />}
                      onClick={async () => {
                        await changeOrganization(value.id);
                        navigate(`/organizations/${value.id}`);
                      }}
                    >
                      Go to organization
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          {loaderData.count > 0 ? (
            <Grid
              size={{ xs: 12 }}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Pagination
                count={Math.max(
                  1,
                  Math.ceil((loaderData?.count || 0) / rowsPerPage),
                )}
                page={page}
                onChange={(_event, newPage) => {
                  const currentParams = Object.fromEntries(
                    searchParams.entries(),
                  );
                  setSearchParams({
                    ...currentParams,
                    skip: String((newPage - 1) * rowsPerPage),
                  });
                }}
              />
            </Grid>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

export default Organizations;
