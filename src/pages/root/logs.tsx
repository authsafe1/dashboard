import { Grid2 as Grid, Typography } from '@mui/material';
import React from 'react';
import { LogViewer } from '../../components';

const LogsPage: React.FC = () => {
  return (
    <>
      <Grid container width="100%" spacing={2} direction="column">
        <Grid container width="100%">
          <Grid rowSpacing={2}>
            <Typography variant="h4">Logs</Typography>
            <Typography color="textSecondary">
              Monitor and analyze system activity, authentication attempts, and
              security events in real time.
            </Typography>
          </Grid>
        </Grid>
        <Grid container width="100%">
          <LogViewer />
        </Grid>
      </Grid>
    </>
  );
};

export default LogsPage;
