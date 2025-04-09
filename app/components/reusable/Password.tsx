import Close from '@mui/icons-material/Close';
import Done from '@mui/icons-material/Done';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Grid,
  IconButton,
  Stack,
  TextField,
  type TextFieldProps,
  Typography,
} from '@mui/material';
import { type FC, useState } from 'react';
import constants from '~/config/constants';

type PasswordProps = Omit<
  TextFieldProps,
  'onChange' | 'error' | 'type' | 'placeholder'
> & { type?: 'first-party' | 'third-party'; isNew?: boolean } & Required<{
    onChange: (value: string) => void;
  }>;

const Password: FC<PasswordProps> = ({
  label,
  autoComplete,
  slotProps,
  type = 'first-party',
  isNew = false,
  onChange,
  ...otherProps
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const specialCharRegex = /[@#!$%^&-]/;
  const numberRegex = /\d/;
  const lengthRegex = /.{8,}/;
  const confirmPasswordError =
    confirmPassword.length !== 0 && password !== confirmPassword;

  return (
    <Grid container spacing={1}>
      <Grid width="100%">
        <TextField
          {...otherProps}
          label={label || isNew ? 'New Password' : 'Password'}
          value={password}
          type={visible ? 'text' : 'password'}
          placeholder={
            type === 'third-party'
              ? "Enter user's password"
              : isNew
              ? 'Enter your new password'
              : 'Enter your password'
          }
          onChange={(event) => {
            setPassword(event.target.value);
            onChange(!confirmPasswordError ? event.target.value : '');
          }}
          error={!constants.passwordRegex.test(password) && password.length > 0}
          autoComplete={autoComplete || 'new-password'}
          slotProps={{
            ...slotProps,
            input: {
              ...slotProps?.input,
              endAdornment: (
                <IconButton onClick={() => setVisible(!visible)}>
                  {visible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              ),
            },
            formHelperText: {
              component: 'div',
            },
          }}
          helperText={
            <Stack spacing={0.5}>
              {uppercaseRegex.test(password) ? (
                <Typography
                  component="span"
                  color="success"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Done fontSize="inherit" color="inherit" />
                  Atleast one uppercase character
                </Typography>
              ) : (
                <Typography
                  component="span"
                  color="error"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Close fontSize="inherit" color="inherit" />
                  Atleast one uppercase character
                </Typography>
              )}
              {lowercaseRegex.test(password) ? (
                <Typography
                  component="span"
                  color="success"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Done fontSize="inherit" color="inherit" />
                  Atleast one lowercase character
                </Typography>
              ) : (
                <Typography
                  component="span"
                  color="error"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Close fontSize="inherit" color="inherit" />
                  Atleast one lowercase character
                </Typography>
              )}
              {specialCharRegex.test(password) ? (
                <Typography
                  component="span"
                  color="success"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Done fontSize="inherit" color="inherit" />
                  Atleast one special character ({`@,#,!,$,%,^,&,-`})
                </Typography>
              ) : (
                <Typography
                  component="span"
                  color="error"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Close fontSize="inherit" color="inherit" />
                  Atleast one special character ({`@,#,!,$,%,^,&,-`})
                </Typography>
              )}
              {numberRegex.test(password) ? (
                <Typography
                  component="span"
                  color="success"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Done fontSize="inherit" color="inherit" />
                  Atleast one digit
                </Typography>
              ) : (
                <Typography
                  component="span"
                  color="error"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Close fontSize="inherit" color="inherit" />
                  Atleast one digit
                </Typography>
              )}
              {lengthRegex.test(password) ? (
                <Typography
                  component="span"
                  color="success"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Done fontSize="inherit" color="inherit" />
                  Atleast 8 characters
                </Typography>
              ) : (
                <Typography
                  component="span"
                  color="error"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Close fontSize="inherit" color="inherit" />
                  Atleast 8 characters
                </Typography>
              )}
            </Stack>
          }
        />
      </Grid>
      <Grid width="100%">
        <TextField
          type="password"
          label={isNew ? 'Confirm new Password' : 'Confirm Password'}
          placeholder={
            type === 'third-party'
              ? "Re-enter user's password"
              : isNew
              ? 'Re-enter your new password'
              : 'Re-enter your password'
          }
          error={confirmPasswordError}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          helperText={confirmPasswordError ? 'Password does not match' : null}
          fullWidth
          slotProps={slotProps}
        />
      </Grid>
    </Grid>
  );
};

export default Password;
