import Add from '@mui/icons-material/Add';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import {
  Autocomplete,
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
import { type FC, useMemo, useState } from 'react';
import { useLoaderData, useRevalidator, useSearchParams } from 'react-router';
import isURL from 'validator/es/lib/isURL';
import { Alert } from '~/components';
import constants from '~/config/constants';
import type { IWebhookLoaderData } from '~/types/models';
import { fetchPaginatedData } from '~/utils/fetchService';
import type { Route } from './+types/webhooks';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const { skip = 0, take = 10 } = Object.fromEntries(
    new URL(request.url).searchParams.entries(),
  );
  return fetchPaginatedData(
    `${import.meta.env.VITE_API_URL}/webhook`,
    +skip,
    +take,
  );
}

interface ICreateWebhookProps {
  open: boolean;
  body: {
    name: string;
    url: string;
    description?: string;
    events: string[];
  };
  validation: { name: boolean; url: boolean; events: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string | string[]) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
}

interface IMoreMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  handleDeletionOpen: () => void;
}

interface IDeleteApplicationProps {
  open: boolean;
  loading: boolean;
  name: string;
  handleClose: () => void;
  handleDelete: () => void;
}

const CreateWebhook: FC<ICreateWebhookProps> = ({
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
      <DialogTitle>Create Webhook</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="Name"
              fullWidth
              required
              placeholder="Enter name of the webhook"
              error={validation.name}
              helperText={validation.url ? 'Must not be blank' : ''}
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
              label="Endpoint"
              fullWidth
              required
              placeholder="Enter webhook endpoint"
              error={validation.url}
              helperText={validation.url ? 'Must not be blank' : ''}
              value={body.url}
              onChange={(event) => handleInputChange('url', event.target.value)}
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
              multiline
              rows={3}
              placeholder="Enter webhook description"
              value={body.description}
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
          <Grid>
            <Autocomplete
              options={constants.eventCatalog}
              groupBy={(option) => option.split('.')[0].toUpperCase()}
              fullWidth
              multiple
              disableCloseOnSelect
              value={body.events}
              onChange={(_event, value) => handleInputChange('events', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Events"
                  required
                  placeholder={
                    params.InputProps.startAdornment
                      ? ''
                      : 'Events to subscribe to'
                  }
                  error={validation.events}
                  helperText={
                    validation.events ? 'Must select atleast one event' : ''
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" loading={loading} onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MoreMenu: FC<IMoreMenuProps> = ({
  anchorEl,
  handleDeletionOpen,
  handleClose,
}) => {
  return (
    <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClose}>
      <MenuItem>Edit</MenuItem>
      <MenuItem sx={{ color: 'error.main' }} onClick={handleDeletionOpen}>
        Delete
      </MenuItem>
    </Menu>
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
      <DialogTitle sx={{ m: 0, p: 2 }}>Delete webhook?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this webhook? This is irreversible and
          associated webhook URLs will be unlinked.
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

interface WebhookBody {
  name: string;
  url: string;
  description?: string;
  events: string[];
}

interface MoreOpenState {
  open: HTMLElement | null;
  state: {
    id: string;
    name: string;
    url: string;
  };
}

const Webhooks = () => {
  const [addWebhook, setAddWebhook] = useState(false);
  const [deletionOpen, setDeletionOpen] = useState(false);
  const [body, setBody] = useState<WebhookBody>({
    name: '',
    url: '',
    description: '',
    events: [],
  });
  const [moreMenuOpen, setMoreMenuOpen] = useState<MoreOpenState>({
    open: null,
    state: { id: '', name: '', url: '' },
  });
  const [validation, setValidation] = useState({
    name: false,
    url: false,
    events: false,
  });
  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });

  const [searchParams, setSearchParams] = useSearchParams();

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

  const { revalidate } = useRevalidator();

  const loaderData = useLoaderData<IWebhookLoaderData>();

  const handleWebhookModalOpen = () => {
    setAddWebhook(true);
  };

  const handleWebhookModalClose = () => {
    setAddWebhook(false);
    setBody({ ...body, name: '', url: '', description: '', events: [] });
  };

  const handleMoreMenuClose = () => {
    setMoreMenuOpen({ ...moreMenuOpen, open: null });
  };

  const handleDeletionModalOpen = () => {
    setDeletionOpen(true);
  };

  const handleDeletionModalClose = () => {
    setDeletionOpen(false);
  };

  const handleDeleteWebhook = async (id: string) => {
    setApiResponse({ ...apiResponse, loading: true });
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/webhook/delete/${id}`,
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
          message: 'Deleted Webhook',
        });
        handleMoreMenuClose();
      } else {
        constants.fetchError(response.status);
      }
    } catch (error: any) {
      setApiResponse({
        ...apiResponse,
        success: false,
        error: true,
        message: error.message || 'Error deleting webhook',
      });
    }
  };

  const handleCreateWebhook = async () => {
    const tempValidation = { ...validation };
    let validationCount = 0;
    if (body.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (body.url.length < 1 || !isURL(body.url)) {
      tempValidation.url = true;
      validationCount++;
    }
    if (body.events.length < 1) {
      tempValidation.events = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      const tempBody = { ...body };
      if ((body?.description as string).length < 1) {
        tempBody.description = undefined;
      }
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/webhook/create`,
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
            message: 'Created new webhook',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: true,
          error: false,
          message: error.message || 'Error creating webhook',
        });
      }
    }
  };

  const handleInputChange = (name: string, value: string | string[]) => {
    setValidation({ ...validation, [name]: false });
    setBody({ ...body, [name]: value });
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
          handleWebhookModalClose();
          handleDeletionModalClose();
        }}
      />
      <MoreMenu
        anchorEl={moreMenuOpen.open}
        handleDeletionOpen={handleDeletionModalOpen}
        handleClose={handleMoreMenuClose}
      />
      <DeletionModal
        open={deletionOpen}
        loading={apiResponse.loading}
        name={moreMenuOpen.state.name}
        handleClose={handleDeletionModalClose}
        handleDelete={() => handleDeleteWebhook(moreMenuOpen.state.id)}
      />
      <CreateWebhook
        open={addWebhook}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        handleInputChange={handleInputChange}
        handleSubmit={handleCreateWebhook}
        handleClose={handleWebhookModalClose}
      />
      <Grid container width="100%" spacing={2} direction="column">
        <Grid container width="100%" justifyContent="space-between">
          <Grid rowSpacing={2}>
            <Typography variant="h4">Webhooks</Typography>
            <Typography color="textSecondary">
              Trigger real-time events, enable dynamic updates, and keep your
              systems synchronized effortlessly.
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={handleWebhookModalOpen}
            >
              Create Webhook
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
                      <Typography fontWeight="bold" gutterBottom>
                        {value.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {value.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Grid container spacing={1} alignItems="center">
                        <Grid>
                          <Typography variant="body2">Events: </Typography>
                        </Grid>
                        {value.events.map((event) => (
                          <Grid key={event}>
                            <Chip label={event} />
                          </Grid>
                        ))}
                      </Grid>
                    </TableCell>
                    <TableCell>{`Created At: ${dayjs(value.createdAt).format(
                      'D MMM YYYY',
                    )}`}</TableCell>
                    <TableCell>{`Updated At: ${dayjs(value.updatedAt).format(
                      'D MMM YYYY',
                    )}`}</TableCell>
                    <TableCell>
                      <Tooltip title="More Info">
                        <IconButton
                          onClick={(event) =>
                            setMoreMenuOpen({
                              ...moreMenuOpen,
                              open: event.currentTarget,
                              state: {
                                id: value.id,
                                name: value.name,
                                url: value.url,
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

export default Webhooks;
