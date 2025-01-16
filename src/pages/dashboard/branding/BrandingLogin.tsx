import { DarkMode, LightMode, Link } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  CardActions,
  CardContent,
  Grid2 as Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { useState } from 'react';
import { useLoaderData, useRevalidator } from 'react-router';
import { Alert, Preview } from '../../../components';
import constants from '../../../config/constants';

const BrandingLogin = () => {
  const theme = useTheme();

  const loaderData = useLoaderData() as any;

  const { revalidate } = useRevalidator();

  const [body, setBody] = useState({
    logo: loaderData.logo || '',
    backgroundImage: loaderData.backgroundImage || '',
    theme: loaderData.theme || 'dark',
    primaryColor: loaderData.primaryColor || theme.palette.primary.main,
    buttonText: loaderData.buttonText || 'Login',
    header: loaderData.header || 'Sign In',
    subHeader: loaderData.subHeader || 'Please enter your details to continue',
  });
  const [apiResponse, setApiResponse] = useState({
    error: false,
    loading: false,
    success: false,
    message: '',
  });

  const handleUpdateBranding = async () => {
    setApiResponse({ ...apiResponse, loading: true });
    const tempBody = { ...body };
    if (tempBody.logo.length === 0) {
      tempBody.logo = undefined;
    }
    if (tempBody.backgroundImage.length === 0) {
      tempBody.backgroundImage = undefined;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/branding/update`,
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
          message: 'Branding updated successfully',
        });
      } else {
        constants.fetchError(response.status);
      }
    } catch (error: any) {
      setApiResponse({
        ...apiResponse,
        success: false,
        error: true,
        message: error.message || 'Error updating branding',
      });
    }
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
        }}
      />
      <Grid container width="100%" spacing={2} direction="column">
        <Grid rowSpacing={2}>
          <Typography variant="h4">Login Customization</Typography>
          <Typography color="textSecondary">
            Personalize the login experience by adding your company logo,
            choosing brand colors, and tailoring the look and feel to match your
            organization's identity.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              p: 2,
            }}
          >
            <CardContent>
              <Grid container spacing={3}>
                <Grid
                  container
                  rowSpacing={5}
                  direction="column"
                  size={{ xs: 12, lg: 5 }}
                >
                  <Grid container rowSpacing={1.5}>
                    <Grid>
                      <Typography color="textSecondary">URL</Typography>
                    </Grid>
                    <Grid container rowSpacing={2} width="100%">
                      <Grid width="100%">
                        <TextField
                          label="Logo"
                          value={body.logo}
                          onChange={(event) =>
                            setBody({ ...body, logo: event.target.value })
                          }
                          fullWidth
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Link />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                      <Grid width="100%">
                        <TextField
                          label="Background Image"
                          value={body.backgroundImage}
                          onChange={(event) =>
                            setBody({
                              ...body,
                              backgroundImage: event.target.value,
                            })
                          }
                          fullWidth
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Link />
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container rowSpacing={1.5}>
                    <Grid>
                      <Typography color="textSecondary">Color</Typography>
                    </Grid>
                    <Grid container rowSpacing={2} width="100%">
                      <Grid width="100%">
                        <MuiColorInput
                          label="Primary"
                          value={body.primaryColor}
                          format="hex"
                          onChange={(color) =>
                            setBody({ ...body, primaryColor: color })
                          }
                          slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container rowSpacing={1.5}>
                    <Grid>
                      <Typography color="textSecondary">Theme</Typography>
                    </Grid>
                    <Grid container rowSpacing={2} width="100%">
                      <Grid width="100%">
                        <Switch
                          value={body.theme}
                          checked={body.theme === 'dark' ? true : false}
                          checkedIcon={<DarkMode htmlColor="black" />}
                          icon={<LightMode htmlColor="#ffff00" />}
                          onChange={(event) =>
                            setBody({
                              ...body,
                              theme: event.target.checked ? 'dark' : 'light',
                            })
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container rowSpacing={1.5}>
                    <Grid>
                      <Typography color="textSecondary">Text</Typography>
                    </Grid>
                    <Grid container rowSpacing={2} width="100%">
                      <Grid width="100%">
                        <TextField
                          label="Header"
                          value={body.header}
                          onChange={(event) =>
                            setBody({ ...body, header: event.target.value })
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid width="100%">
                        <TextField
                          label="Subheader"
                          value={body.subHeader}
                          onChange={(event) =>
                            setBody({ ...body, subHeader: event.target.value })
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid width="100%">
                        <TextField
                          label="Login Button"
                          value={body.buttonText}
                          onChange={(event) =>
                            setBody({
                              ...body,
                              buttonText: event.target.value,
                            })
                          }
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Preview
                  size={{ xs: 12, lg: 7 }}
                  logo={body.logo}
                  backgroundImage={body.backgroundImage}
                  theme={body.theme as 'light' | 'dark'}
                  header={body.header}
                  subHeader={body.subHeader}
                  loginButtonText={body.buttonText}
                  primaryColor={body.primaryColor}
                />
              </Grid>
            </CardContent>
            <CardActions>
              <LoadingButton
                variant="contained"
                loading={apiResponse.loading}
                onClick={handleUpdateBranding}
              >
                Save
              </LoadingButton>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default BrandingLogin;
