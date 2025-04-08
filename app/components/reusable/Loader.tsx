import { Backdrop, Box, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { type FC } from 'react';
import AuthSafeIcon from '~/components/icons/AuthSafeIcon';

const RouteLoader: FC = () => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress size={60} sx={{ color: 'text.secondary' }} />
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

const ScreenLoader: FC = () => {
  const theme = useTheme();
  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={true}
    >
      <Box style={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress size={60} sx={{ color: 'text.secondary' }} />
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
    </Backdrop>
  );
};
export { RouteLoader, ScreenLoader };
