import {
  Card,
  CardActions,
  CardContent,
  Grid2 as Grid,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import { Link, LoaderFunction, useLoaderData } from 'react-router';

export const dataLoader: LoaderFunction = async ({ request }) => {
  const token = new URL(request.url).searchParams.get('token');
  return await fetch(
    `${import.meta.env.VITE_API_URL}/organization/confirm?token=${token}`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

const AuthConfirm = () => {
  const loaderData: any = useLoaderData();

  return (
    <Grid container height="100vh" justifyContent="center" alignItems="center">
      <Grid>
        <Card
          variant="outlined"
          sx={{
            border: (theme) => `2px solid ${theme.palette.primary.main}`,
            p: 4,
            maxWidth: 500,
            minHeight: 200,
            textAlign: 'center',
          }}
        >
          <CardContent>
            <Typography component="p" variant="h5">
              {loaderData.message === 'Verified'
                ? 'Organization verified'
                : 'Could not verify user!'}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: 'center' }}>
            <MuiLink component={Link} to="/auth/signin" replace>
              Back to SignIn
            </MuiLink>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AuthConfirm;
