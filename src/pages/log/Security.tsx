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

interface ISecurityAlertLoaderData {
  count: number;
  all: {
    id: string;
    message: string;
    severity: string;
    ip: string;
    url: string;
    createdAt: Date;
  }[];
}

const SecurityLog = () => {
  const loaderData = useLoaderData() as ISecurityAlertLoaderData;

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
        <Typography variant="h4">Security Logs</Typography>
        <Typography color="textSecondary">
          Stay informed about potential threats with a comprehensive log of all
          security alerts.
        </Typography>
      </Grid>
      <Grid width="100%">
        <Paper variant="outlined">
          <TableContainer sx={{ maxHeight: 750 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Message</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Created At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loaderData && loaderData?.count ? (
                  loaderData?.all.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>{alert.severity}</TableCell>
                      <TableCell>{alert.ip}</TableCell>
                      <TableCell
                        style={{
                          maxWidth: 200,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <span title={alert.url}>{alert.url}</span>
                      </TableCell>
                      <TableCell>
                        {dayjs(alert.createdAt).toLocaleString()}
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

export default SecurityLog;
