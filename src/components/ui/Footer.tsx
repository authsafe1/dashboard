import { Box, Container, Grid2 as Grid, Link, Typography } from '@mui/material';
import { FC } from 'react';
import AuthSafeIcon from '../icons/AuthSafeIcon';

const Footer: FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 2 }} component="footer">
      <Grid container width="100%" justifyContent="space-evenly">
        <Grid>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AuthSafeIcon fontSize="large" />
            <Typography variant="h5" fontWeight="bold">
              AuthSafe
            </Typography>
          </Box>
        </Grid>
        <Grid>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link>Contact</Link>
            <Link>Privacy</Link>
            <Link>Compliance</Link>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;
