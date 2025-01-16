import { Box, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { FC } from 'react';
import AuthSafeIcon from '../icons/AuthSafeIcon';

const RouteLoader: FC = () => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          size={60}
          sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
        />
        <AuthSafeIcon
          theme={theme.palette.mode}
          fontSize="large"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </Box>
    </Box>
  );
};

export default RouteLoader;
