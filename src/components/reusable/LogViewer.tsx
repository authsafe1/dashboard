import {useEffect, useState} from "react";
import {Box, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select,} from "@mui/material";
import {Light as SyntaxHighlighter} from "react-syntax-highlighter";
import {atomOneDark} from "react-syntax-highlighter/dist/esm/styles/hljs";

const LOG_LEVELS = ["info", "error", "warn", "debug", "verbose"];
const LOG_TYPES = ["authorization", "security", "activity"];
const REFRESH_INTERVALS = [2, 5, 10]; // in seconds

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [logLevel, setLogLevel] = useState("");
  const [logType, setLogType] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/log?level=${logLevel}&type=${logType}`
        );
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [logLevel, logType, refreshInterval]);

  return (
    <Paper sx={{p: 3}}>
      <Box display="flex" gap={2} mb={2}>
        <FormControl size="small">
          <InputLabel>Log Level</InputLabel>
          <Select
            value={logLevel}
            onChange={(e) => setLogLevel(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {LOG_LEVELS.map((level) => (
              <MenuItem key={level} value={level}>{level}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Log Type</InputLabel>
          <Select
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {LOG_TYPES.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Refresh Interval (s)</InputLabel>
          <Select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
          >
            {REFRESH_INTERVALS.map((interval) => (
              <MenuItem key={interval} value={interval}>{interval}s</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <CircularProgress/>
      ) : (
        <Box sx={{maxHeight: 500, overflowY: "auto"}}>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <SyntaxHighlighter
                key={index}
                language="json"
                style={atomOneDark}
                wrapLines={true}
                customStyle={{padding: "10px", borderRadius: "8px"}}
              >
                {JSON.stringify(log, null, 2)}
              </SyntaxHighlighter>
            ))
          ) : (
            <Box>No logs available</Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default LogViewer;
