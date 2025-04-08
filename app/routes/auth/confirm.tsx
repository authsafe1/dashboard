import {
  Box,
  Card,
  CardActions,
  CardContent,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import { Link, useLoaderData } from 'react-router';
import { fetchApi } from '~/utils/loaders';
import type { Route } from './+types/confirm';

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) throw new Error('Token is required');
  const url = `${import.meta.env.VITE_API_URL}/profile/confirm?token=${token}`;
  return fetchApi(url, { method: 'POST' });
}

const AuthConfirm = () => {
  const loaderData: any = useLoaderData();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          flex: '1 1 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          p: 2,
        }}
      >
        <Card
          sx={{
            p: 4,
            maxWidth: 500,
            minHeight: 200,
            textAlign: 'center',
            borderRadius: 5,
            boxShadow: `0px 4px 10px rgba(91, 25, 145, 0.2), 0px 1px 5px rgba(0, 0, 0, 0.12), 0px 10px 20px 5px rgba(177, 83, 254, 0.15)`,
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
      </Box>
    </Box>
  );
};

export default AuthConfirm;
