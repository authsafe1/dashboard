import { Box, useTheme } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { FC } from 'react';
import AuthSafeIcon from '../icons/AuthSafeIcon';

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

export default ScreenLoader;
