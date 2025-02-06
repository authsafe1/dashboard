import {
  Grid2 as Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useLoaderData, useSearchParams } from 'react-router';

interface IAuthorizationLogLoaderData {
  count: number;
  all: {
    id: string;
    action: string;
    ip: string;
    User: { name: string };
    Client: { name: string };
    createdAt: Date;
  }[];
}

const AuthorizationLog = () => {
  const loaderData = useLoaderData() as IAuthorizationLogLoaderData;

  const [searchParams, setSearchParams] = useSearchParams();

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

  return (
    <Grid container width="100%" spacing={2} direction="column">
      <Grid rowSpacing={2}>
        <Typography variant="h4">Authorization Logs</Typography>
        <Typography color="textSecondary">
          Review detailed records of authorization events to monitor access and
          enforce security policies.
        </Typography>
      </Grid>
      <Grid width="100%">
        <Paper variant="outlined">
          <TableContainer sx={{ maxHeight: 750 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loaderData && loaderData?.count ? (
                  loaderData?.all.map((log) => (
                    <TableRow key={log?.id}>
                      <TableCell>{log?.action}</TableCell>
                      <TableCell>{log?.ip}</TableCell>
                      <TableCell>{log?.User?.name}</TableCell>
                      <TableCell>{log?.Client?.name}</TableCell>
                      <TableCell>
                        {dayjs(log?.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography>No Data</Typography>
                    </TableCell>
                  </TableRow>
                )}
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
                const currentParams = Object.fromEntries(
                  searchParams.entries(),
                );
                setSearchParams({
                  ...currentParams,
                  skip: String(newPage * rowsPerPage),
                });
              }}
              onRowsPerPageChange={(event) => {
                const currentParams = Object.fromEntries(
                  searchParams.entries(),
                );
                setSearchParams({
                  ...currentParams,
                  take: event.target.value,
                });
              }}
            />
          ) : null}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AuthorizationLog;
