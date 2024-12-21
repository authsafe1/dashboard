import { ArrowBack, ArrowForward, Refresh } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createTheme,
  Divider,
  Grid2 as Grid,
  Grid2Props,
  Paper,
  ScopedCssBaseline,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { FC } from 'react';
import AuthSafeIcon from '../icons/AuthSafeIcon';

interface IPreviewProps {
  logo?: string;
  backgroundImage?: string;
  theme?: 'light' | 'dark';
  header?: string;
  subHeader?: string;
  loginButtonText?: string;
  primaryColor?: string;
  size?: Grid2Props['size'];
}

const Preview: FC<IPreviewProps> = ({
  logo,
  backgroundImage,
  theme,
  header,
  subHeader,
  loginButtonText,
  primaryColor,
  size,
}) => {
  const customTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: primaryColor as string,
      },
    },
  });
  return (
    <Grid
      container
      size={size}
      bgcolor={theme === 'dark' ? 'black' : 'white'}
      sx={{
        backgroundImage: `url(${backgroundImage ? backgroundImage : ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
      }}
      borderRadius={2}
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          p: 1.5,
          gap: 2,
          alignItems: 'center',
          width: '100%',
          borderRadius: 0,
        }}
      >
        <ArrowBack fontSize="small" />
        <ArrowForward fontSize="small" />
        <Refresh fontSize="small" />
        <Box
          sx={{
            display: 'flex',
            border: (theme) => `0.5px solid ${theme.palette.grey[700]}`,
            p: 0.5,
            borderRadius: 0.5,
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Typography fontSize="small" noWrap>
            {`https://${
              import.meta.env.VITE_API_URL
            }/oauth2/authorize?organization_id=xxxxxx&client_id=xxxxxx`}
          </Typography>
        </Box>
      </Paper>
      <ThemeProvider theme={customTheme}>
        <ScopedCssBaseline />
        <Grid container padding={{ xs: 2, sm: 5, md: 8, lg: 10 }}>
          <Card
            elevation={5}
            sx={{
              p: 4,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {logo?.length !== 0 ? (
                <Avatar src={logo} sx={{ width: 50, height: 50 }} />
              ) : null}
            </Box>
            <CardHeader
              title={header}
              subheader={subHeader}
              sx={{ textAlign: 'center' }}
            />
            <CardContent>
              <Grid container spacing={3} padding={2}>
                <Grid width="100%">
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value="john.doe@example.com"
                    required
                    fullWidth
                  />
                </Grid>
                <Grid width="100%">
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value="new-password"
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid container width="100%" rowSpacing={3}>
                <Grid
                  container
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid>
                    <Button variant="contained" size="large">
                      {loginButtonText}
                    </Button>
                  </Grid>
                </Grid>
                <Grid container width="100%">
                  <Grid width="100%">
                    <Divider />
                  </Grid>
                </Grid>
                <Grid
                  container
                  width="100%"
                  justifyContent="center"
                  spacing={0.5}
                >
                  <Grid>
                    <Typography component="span">Secured by</Typography>
                  </Grid>
                  <Grid>
                    <AuthSafeIcon theme={theme} />
                  </Grid>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </ThemeProvider>
    </Grid>
  );
};

export default Preview;
