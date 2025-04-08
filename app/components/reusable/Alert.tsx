import { Alert as MuiAlert, Snackbar } from '@mui/material';
import type { FC } from 'react';

interface AlertProps {
  handleClose: () => void;
  error?: boolean;
  success: boolean;
  message: string;
}

const Alert: FC<AlertProps> = ({ error, success, message, handleClose }) => {
  if (error) {
    return (
      <Snackbar
        open={error}
        onClose={handleClose}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MuiAlert severity="error" variant="filled" sx={{ width: '100%' }}>
          {message}
        </MuiAlert>
      </Snackbar>
    );
  } else if (success) {
    return (
      <Snackbar
        open={success}
        onClose={handleClose}
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MuiAlert severity="success" variant="filled" sx={{ width: '100%' }}>
          {message}
        </MuiAlert>
      </Snackbar>
    );
  } else {
    return null;
  }
};

export default Alert;
