import {
  Box,
  CircularProgress,
  Grid2 as Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { blue, green, orange, purple, red } from '@mui/material/colors';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

const LOG_TYPES = ['authorization', 'security', 'activity'];
const REFRESH_INTERVALS = [2, 5, 10]; // in seconds

const levelColors: Record<string, string> = {
  info: blue[700], // MUI Blue
  error: red[700], // MUI Red
  warn: orange[700], // MUI Orange
  debug: green[700], // MUI Green
  verbose: purple[700], // MUI Purple
};

const LogViewer = () => {
  const [logs, setLogs] = useState<[string, string][]>([]);
  const [logType, setLogType] = useState('activity');
  const [startTime, setStartTime] = useState<Dayjs | null>(
    dayjs().subtract(1, 'day'),
  );
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs());
  const [refreshInterval, setRefreshInterval] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async (showLoader = false) => {
      if (showLoader) setLoading(true);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/log?startTime=${startTime?.toISOString()}&endTime=${endTime?.toISOString()}&type=${logType}`,
          {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
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

  return (
    <Grid
      component={Paper}
      container
      sx={{ p: 3 }}
      variant="outlined"
      width="100%"
      spacing={2}
    >
      <Grid container width="100%" spacing={1}>
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <TextField
            label="Log Type"
            size="small"
            fullWidth
            select
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
          >
            {LOG_TYPES.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
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
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                p: 1,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : logs.length > 0 ? (
            logs.map((object, index) => {
              const timestamp = object[0];
              const logData = object[1];
              console.log(timestamp, logData);
              const logObject = JSON.parse(logData);
              const logTimestamp = new Date(
                Number(timestamp) / 1e6,
              ).toISOString();
              const logLevel = logObject.level || 'info';
              const logMessage = logObject.message || 'No message';

              return (
                <Box
                  key={`${index}-${timestamp}`}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 1,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {/* Timestamp */}
                  <Typography
                    variant="body2"
                    sx={{ color: 'gray', minWidth: '200px' }}
                  >
                    {logTimestamp}
                  </Typography>

                  {/* Log Level */}
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

                  {/* Log Message */}
                  <Typography variant="body2">{logMessage}</Typography>
                </Box>
              );
            })
          ) : (
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                p: 1,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="body2">No Logs available</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LogViewer;
