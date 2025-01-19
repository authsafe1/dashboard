import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  CardActions,
  CardContent,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  MobileStepper,
  Stack,
  Step,
  StepButton,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';
import isEmail from 'validator/es/lib/isEmail';
import isURL from 'validator/es/lib/isURL';
import { Password, PermissionPicker } from '../../components';
import constants from '../../config/constants';

interface ICreateUserProps {
  body: {
    name: string;
    email: string;
    password: string;
  };
  validation: { name: boolean; email: boolean; password: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: () => Promise<void>;
}

interface ICreateApplicationProps {
  body: {
    name: string;
    redirectUri?: string;
    grant: string;
  };
  validation: { name: boolean; redirectUri: boolean; grant: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: () => Promise<void>;
}

interface ICreatePermissionProps {
  body: { name: string; key: string; description: string };
  validation: { name: boolean; key: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: string) => void;
  handleSubmit: () => Promise<void>;
}

interface ICreateRoleProps {
  body: { name: string; key: string; description: string; permissions: any[] };
  validation: { name: boolean; key: boolean; permissions: boolean };
  loading: boolean;
  handleInputChange: (name: string, value: any) => void;
  handleSubmit: () => Promise<void>;
}

const CreateUser: FC<ICreateUserProps> = ({
  body,
  validation,
  loading,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
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
      </CardContent>
      <CardActions>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={handleSubmit}
        >
          Create User
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

const CreateApplication: FC<ICreateApplicationProps> = ({
  body,
  validation,
  loading,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid width="100%">
            <TextField
              label="Name"
              fullWidth
              required
              placeholder="Enter application name"
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
            <Grid width="100%">
              <TextField
                label="Redirect URI"
                fullWidth
                required
                type="url"
                autoComplete="url"
                placeholder="Enter redirect uri"
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
          <Grid width="100%">
            <TextField
              label="Grant"
              required
              select
              value={body.grant}
              fullWidth
              onChange={(event) =>
                handleInputChange('grant', event.target.value)
              }
            >
              {constants.grants.map(({ title, description, value }) => (
                <MenuItem key={value} value={value}>
                  <Stack>
                    <Typography gutterBottom overflow="clip">
                      {title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      overflow="clip"
                    >
                      {description}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={handleSubmit}
        >
          Create Application
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

const CreatePermission: FC<ICreatePermissionProps> = ({
  body,
  validation,
  loading,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <Card variant="outlined">
      <CardContent>
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
      </CardContent>
      <CardActions>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={handleSubmit}
        >
          Create Permission
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

const CreateRole: FC<ICreateRoleProps> = ({
  body,
  validation,
  loading,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Grid container spacing={2} p={1} width="100%" direction="column">
          <Grid>
            <TextField
              label="Name"
              fullWidth
              required
              placeholder="Enter role name"
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
              placeholder="key"
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
              placeholder="Enter role description"
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
      </CardContent>
      <CardActions>
        <LoadingButton
          variant="contained"
          loading={loading}
          onClick={handleSubmit}
        >
          Create Role
        </LoadingButton>
      </CardActions>
    </Card>
  );
};

interface ClientBody {
  name: string;
  redirectUri?: string;
  grant: string;
}

const QuickStart = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [userBody, setUserBody] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [clientBody, setClientBody] = useState<ClientBody>({
    name: '',
    redirectUri: '',
    grant: 'code',
  });
  const [permissionBody, setPermissionBody] = useState({
    name: '',
    key: '',
    description: '',
  });
  const [roleBody, setRoleBody] = useState({
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
  const [userValidation, setUserValidation] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [clientValidation, setClientValidation] = useState({
    name: false,
    redirectUri: false,
    grant: false,
  });
  const [permissionValidation, setPermissionValidation] = useState({
    name: false,
    key: false,
  });
  const [roleValidation, setRoleValidation] = useState({
    name: false,
    key: false,
    permissions: false,
  });

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const handleCreateUser = async () => {
    const tempValidation = { ...userValidation };
    let validationCount = 0;
    if (userBody.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (
      userBody.email.length < 1 ||
      (userBody.email.length > 1 && !isEmail(userBody.email))
    ) {
      tempValidation.email = true;
      validationCount++;
    }
    if (userBody.password.length < 6) {
      tempValidation.password = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setUserValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/user/create`,
          {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(userBody),
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
            message: 'Created new user',
          });
          setActiveStep(1);
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: true,
          error: false,
          loading: false,
          message: error.message || 'Error creating user',
        });
      }
    }
  };

  const handleCreateClient = async () => {
    const tempValidation = { ...clientValidation };
    let validationCount = 0;
    if (clientBody.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (
      (clientBody?.redirectUri as string).length > 1 &&
      !isURL(clientBody?.redirectUri as string)
    ) {
      tempValidation.redirectUri = true;
      validationCount++;
    }
    if (clientBody.grant.length < 1) {
      tempValidation.grant = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setClientValidation(tempValidation);
    } else {
      const tempBody = { ...clientBody };
      if ((clientBody?.redirectUri as string).length < 1) {
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
            loading: false,
            message: 'Created new client',
          });
          setActiveStep(2);
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: true,
          error: false,
          loading: false,
          message: error.message || 'Error creating client',
        });
      }
    }
  };

  const handleCreatePermission = async () => {
    const tempValidation = { ...permissionValidation };
    let validationCount = 0;
    if (permissionBody.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (!/^[a-z0-9_]+:[a-z0-9_]+$/.test(permissionBody.key)) {
      tempValidation.key = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setPermissionValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/permission/create`,
          {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(permissionBody),
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
            message: 'Created new permission',
          });
          setActiveStep(3);
        } else {
          constants.fetchError(response.status);
        }
      } catch (error: any) {
        setApiResponse({
          ...apiResponse,
          success: true,
          error: false,
          loading: false,
          message: error.message || 'Error creating permission',
        });
      }
    }
  };

  const handleCreateRole = async () => {
    const tempValidation = { ...roleValidation };
    let validationCount = 0;
    if (roleBody.name.length < 1) {
      tempValidation.name = true;
      validationCount++;
    }
    if (!/^[a-z0-9_]+$/.test(roleBody.key)) {
      tempValidation.key = true;
      validationCount++;
    }
    if (roleBody.permissions.length < 1) {
      tempValidation.permissions = true;
      validationCount++;
    }
    if (validationCount > 0) {
      setRoleValidation(tempValidation);
    } else {
      setApiResponse({ ...apiResponse, loading: true });
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/role/create`,
          {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(roleBody),
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
          loading: false,
          message: error.message || 'Error creating role',
        });
      }
    }
  };

  const handleUserInputChange = (name: string, value: string) => {
    setUserValidation({ ...userValidation, [name]: false });
    setUserBody({ ...userBody, [name]: value });
  };

  const handleClientInputChange = (name: string, value: string) => {
    setClientValidation({ ...clientValidation, [name]: false });
    setClientBody({ ...clientBody, [name]: value });
  };

  const handlePermissionInputChange = (name: string, value: string) => {
    setPermissionValidation({ ...permissionValidation, [name]: false });
    setPermissionBody({ ...permissionBody, [name]: value });
  };

  const handleRoleInputChange = (name: string, value: any) => {
    setRoleValidation({ ...roleValidation, [name]: false });
    setRoleBody({ ...roleBody, [name]: value });
  };

  const handleStepRender = (step: number) => {
    switch (step) {
      case 0:
        return (
          <CreateUser
            body={userBody}
            validation={userValidation}
            loading={apiResponse.loading}
            handleSubmit={handleCreateUser}
            handleInputChange={handleUserInputChange}
          />
        );
      case 1:
        return (
          <CreateApplication
            body={clientBody}
            validation={clientValidation}
            loading={apiResponse.loading}
            handleSubmit={handleCreateClient}
            handleInputChange={handleClientInputChange}
          />
        );
      case 2:
        return (
          <CreatePermission
            body={permissionBody}
            validation={permissionValidation}
            loading={apiResponse.loading}
            handleInputChange={handlePermissionInputChange}
            handleSubmit={handleCreatePermission}
          />
        );
      case 3:
        return (
          <CreateRole
            body={roleBody}
            validation={roleValidation}
            loading={apiResponse.loading}
            handleSubmit={handleCreateRole}
            handleInputChange={handleRoleInputChange}
          />
        );
    }
  };

  return (
    <Grid container width="100%" spacing={2} direction="column">
      <Grid rowSpacing={2}>
        <Typography variant="h4">Quick Start</Typography>
        <Typography color="textSecondary">
          Quickly set up your application with AuthSafe to manage users, roles,
          and permissions effortlessly.
        </Typography>
      </Grid>
      <Grid width="100%">
        {isMobile ? (
          <Card variant="outlined">
            <CardContent>{handleStepRender(activeStep)}</CardContent>
            <CardActions>
              <MobileStepper
                variant="dots"
                steps={constants.gettingStartedSteps.length}
                position="static"
                activeStep={activeStep}
                nextButton={
                  <IconButton
                    onClick={() => setActiveStep(activeStep + 1)}
                    disabled={
                      activeStep === constants.gettingStartedSteps.length - 1
                    }
                  >
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowLeft />
                    ) : (
                      <KeyboardArrowRight />
                    )}
                  </IconButton>
                }
                backButton={
                  <IconButton
                    onClick={() => setActiveStep(activeStep - 1)}
                    disabled={activeStep === 0}
                  >
                    {theme.direction === 'rtl' ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                  </IconButton>
                }
                sx={{ width: '100%' }}
              />
            </CardActions>
          </Card>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Grid container rowSpacing={4} width="100%" alignItems="center">
                <Grid width="100%">
                  <Stepper nonLinear activeStep={activeStep}>
                    {constants.gettingStartedSteps.map((value, index) => (
                      <Step key={value}>
                        <StepButton
                          color="inherit"
                          onClick={() => handleStepChange(index)}
                        >
                          {value}
                        </StepButton>
                      </Step>
                    ))}
                  </Stepper>
                </Grid>
                <Grid width="100%">{handleStepRender(activeStep)}</Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

export default QuickStart;
