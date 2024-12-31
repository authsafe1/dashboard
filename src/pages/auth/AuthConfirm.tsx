import {
  Card,
  CardActions,
  CardContent,
  Grid2 as Grid,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import { Link, useLoaderData } from 'react-router';

const AuthConfirm = () => {
  const loaderData: any = useLoaderData();

  return (
    <Grid
      container
      height="100vh"
      justifyContent="center"
      alignItems="center"
      py={6}
      px={4}
    >
      <Grid>
        <Card
          sx={{
            p: 4,
            m: 4,
            maxWidth: 500,
            minHeight: 200,
            textAlign: 'center',
            borderRadius: 5,
            boxShadow: `
    0px 4px 6px rgba(91, 25, 145, 0.2), /* Subtle brand shadow for depth */
    0px 1px 3px rgba(0, 0, 0, 0.12), /* Soft inner shadow for realism */
    0px 10px 20px 4px rgba(177, 83, 254, 0.15) /* Vibrant glow effect */
  `,
          }}
          elevation={5}
        >
          <CardContent>
            <Typography component="p" variant="h5">
              {loaderData.message === 'Verified'
                ? 'Organization verified'
                : 'Could not verify user!'}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <MuiLink component={Link} to="/auth/login" replace variant="body2">
              Back to SignIn
            </MuiLink>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AuthConfirm;
