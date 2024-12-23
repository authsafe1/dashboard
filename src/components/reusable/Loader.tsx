import { useTheme } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { FC } from 'react';
import AuthSafeIcon from '../icons/AuthSafeIcon';

const Loader: FC<{ loading: boolean }> = ({ loading }) => {
  const theme = useTheme();
  return (
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={loading}
    >
      <div style={{ position: 'relative', display: 'inline-flex' }}>
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
      </div>
    </Backdrop>
  );
};

export default Loader;
