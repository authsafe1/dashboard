import {
  CircularProgress,
  Grid2 as Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TablePaginationOwnProps,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';

const SecurityLog = () => {
  const [data, setData] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const handleChangePage: TablePaginationOwnProps['onPageChange'] = (
    _event,
    newPage,
  ) => {
    setPage(newPage);
  };

  const fetchData = useCallback(async () => {
    const skip = page * rowsPerPage;
    const take = rowsPerPage;
    setLoading(true);
    try {
      const response = await fetch(`/api/organization/log/security/all`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skip, take }),
      });
      const result = await response.json();

      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [page, rowsPerPage]);

  const fetchTotalCount = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/organization/log/security/count`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();

      setTotalCount(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  }, []);

  const handleChangeRowsPerPage: TablePaginationOwnProps['onRowsPerPageChange'] =
    (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  useEffect(() => {
    fetchTotalCount();
  }, [fetchTotalCount]);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, fetchData]);

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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} rowSpan={rowsPerPage} align="center">
                      <CircularProgress color="inherit" />
                    </TableCell>
                  </TableRow>
                ) : data.length !== 0 ? (
                  data.map((alert) => (
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
          {data?.length !== 0 ? (
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Rows per page"
            />
          ) : null}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SecurityLog;
