import { Add, MoreHoriz } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
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
import { Alert, GeneralTooltip, PermissionPicker } from '../../components';
import constants from '../../config/constants';

interface IRoleLoaderData {
  id: string;
  name: string;
  key: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ICreateRoleProps {
  open: boolean;
  body: { name: string; key: string; description: string; permissions: any[] };
  validation: { name: boolean; key: boolean; permissions: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: any) => void;
  handleSubmit: () => Promise<void>;
  handleClose: () => void;
}

const CreateRole: FC<ICreateRoleProps> = ({
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
      <DialogTitle>Create Role</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="Name"
              fullWidth
              required
              placeholder="e.g. Sys Admin"
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
              placeholder="sys_admin"
              error={validation.key}
              helperText={validation.key ? 'Must not be blank' : ''}
              value={body.key}
              onChange={(event) => handleInputChange('key', event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">org:</InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid>
            <TextField
              label="Description"
              fullWidth
              placeholder="e.g. User allowed to configure system resources"
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
          <Grid>
            <PermissionPicker
              multiple
              required
              error={validation.permissions}
              helperText="Atleast one permission must be selected"
              onPermissionSelect={(permissions) =>
                handleInputChange('permissions', permissions)
              }
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

const Roles = () => {
  const [addRole, setAddRole] = useState(false);
  const [body, setBody] = useState({
    name: '',
    key: '',
    description: '',
    permissions: [],
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
    permissions: false,
  });

  const { revalidate } = useRevalidator();

  const loaderData = useLoaderData() as IRoleLoaderData[];

  const handleCreateRole = async () => {
    const tempValidation = { ...validation };
    let validationCount = 0;
    if (body.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (!/^[a-z0-9_]+$/.test(body.key)) {
      tempValidation.key = true;
      validationCount++;
    }
    if (body.permissions.length < 1) {
      tempValidation.permissions = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(`/api/role/create`, {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          setApiResponse({
            ...apiResponse,
            success: true,
            error: false,
            message: 'Created new role',
          });
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: true,
          error: false,
          message: error.message || 'Error creating role',
        });
      }
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setValidation({ ...validation, [name]: false });
    setBody({ ...body, [name]: value });
  };

  const handleRoleModalClose = () => {
    setBody({ ...body, name: '', key: '', description: '', permissions: [] });
    setAddRole(false);
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
          handleRoleModalClose();
        }}
      />
      <CreateRole
        open={addRole}
        body={body}
        validation={validation}
        loading={apiResponse.loading}
        handleClose={handleRoleModalClose}
        handleSubmit={handleCreateRole}
        handleInputChange={handleInputChange}
      />
      <Grid container width="100%" spacing={2} direction="column">
        <Grid container width="100%" justifyContent="space-between">
          <Grid rowSpacing={2}>
            <Typography variant="h4">Roles</Typography>
            <Typography color="textSecondary">
              Define user access levels and roles to ensure appropriate access
              to resources within your organization.
            </Typography>
          </Grid>
          <Grid>
            <Button
              variant="contained"
              size="large"
              startIcon={<Add />}
              onClick={() => setAddRole(true)}
            >
              Create Role
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Grid} justifyContent="center" width="100%">
          <Table>
            <TableBody>
              {loaderData.map((value) => (
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
      </Grid>
    </>
  );
};

export default Roles;
