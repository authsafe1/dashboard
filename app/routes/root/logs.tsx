import {
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { blue, green, orange, purple, red } from '@mui/material/colors';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React, { type FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

const LOG_TYPES = [
  { label: 'Authorization', value: 'authorization' },
  { label: 'Security', value: 'security' },
  { label: 'Activity', value: 'activity' },
];
const REFRESH_INTERVALS = [2, 5, 10]; // in seconds

const levelColors: Record<string, string> = {
  info: blue[700], // MUI Blue
  error: red[700], // MUI Red
  warn: orange[700], // MUI Orange
  debug: green[700], // MUI Green
  verbose: purple[700], // MUI Purple
};

const LogViewer: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [logs, setLogs] = useState<[string, string][]>([]);
  const [logType, setLogType] = useState(
    LOG_TYPES.map(({ value }) => value).includes(searchParams.get('type')!)
      ? searchParams.get('type')
      : 'activity',
  );
  const [startTime, setStartTime] = useState<dayjs.Dayjs | null>(
    dayjs().subtract(1, 'day'),
  );
  const [endTime, setEndTime] = useState<dayjs.Dayjs | null>(dayjs());
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async (showLoader = false) => {
      if (showLoader) setLoading(true);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/log?startTime=${startTime?.toISOString()}&endTime=${endTime?.toISOString()}&type=${logType}&_=${new Date().getTime()}`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
          },
        );
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        if (showLoader) setLoading(false);
      }
    };

    fetchLogs(true);
    const interval = setInterval(fetchLogs, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [logType, refreshInterval, startTime, endTime]);

  const ViewLogs =
    logs.length > 0 ? (
      logs.map((object, index) => {
        const timestamp = object[0];
        const logData = object[1];
        const logObject = JSON.parse(logData);
        const logTimestamp = new Date(Number(timestamp) / 1e6).toISOString();
        const logLevel = logObject.level || 'info';
        const logMessage = logObject.message || 'No message';
        return (
          <TableRow key={index}>
            <TableCell sx={{ width: 300 }}>
              <Typography variant="body2" sx={{ color: 'gray' }}>
                {dayjs(logTimestamp).format('D MMM YYYY HH:mm:ss (UTC Z)')}
              </Typography>
            </TableCell>
            <TableCell sx={{ width: 100 }}>
              <Typography
                variant="body2"
                sx={{
                  color: levelColors[logLevel] || 'white',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  minWidth: '80px',
                }}
              >
                {logLevel}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body2">{logMessage}</Typography>
            </TableCell>
          </TableRow>
        );
      })
    ) : (
      <TableRow>
        <TableCell>
          <Typography variant="body2" sx={{ fontSize: 'medium' }}>
            No logs available
          </Typography>
        </TableCell>
      </TableRow>
    );

  return (
    <Grid
      component={Paper}
      container
      sx={{ p: 3 }}
      variant="outlined"
      width="100%"
      spacing={2}
    >
      <Grid container width="100%" spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <TextField
            label="Log Type"
            size="small"
            fullWidth
            select
            value={logType}
            onChange={(e) => {
              setLogType(e.target.value);
              setSearchParams({
                type: e.target.value,
              });
            }}
          >
            {LOG_TYPES.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <DateTimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <TextField
            label="Refresh Interval (s)"
            size="small"
            fullWidth
            select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
          >
            {REFRESH_INTERVALS.map((interval) => (
              <MenuItem key={interval} value={interval}>
                {interval}s
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Grid container width="100%" sx={{ height: 500, overflow: 'auto' }}>
        <Grid size={{ xs: 12 }}>
          <TableContainer>
            <Table>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  ViewLogs
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
};

const LogsPage: React.FC = () => {
  return (
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
  );
};

export default LogsPage;
