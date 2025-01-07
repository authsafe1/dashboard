import { Add, MoreHoriz } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
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
import { Alert, GeneralTooltip } from '../components';
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

const ApiKeys = () => {
  const [addApiKey, setAddApiKey] = useState(false);
  const [body, setBody] = useState({
    name: '',
    description: '',
    expiresAt: dayjs().add(1, 'hour').toDate(),
  });
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

  const handleInputChange = (
    name: string,
    value: string | Date | undefined,
  ) => {
    setValidation({ ...validation, [name]: false });
    setBody({ ...body, [name]: value });
  };

  const handleApiKeyModalClose = () => {
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
          handleApiKeyModalClose();
        }}
      />
      <CreateApiKey
        open={addApiKey}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        handleClose={handleApiKeyModalClose}
        handleInputChange={handleInputChange}
        handleSubmit={handleCreateApiKey}
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
                        <IconButton>
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
