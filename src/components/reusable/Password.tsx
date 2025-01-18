import { Close, Done, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  IconButton,
  Stack,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { FC, useState } from 'react';

type PasswordProps = Omit<TextFieldProps, 'onChange' | 'error' | 'type'> &
  Required<{ onChange: (value: string) => void }>;

const Password: FC<PasswordProps> = ({
  label,
  autoComplete,
  slotProps,
  onChange,
  ...otherProps
}) => {
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const specialCharRegex = /[@#!$%^&]/;
  const numberRegex = /\d/;
  const lengthRegex = /.{8,}/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[@#!$%^&])(?=.*\d).{8,}$/;

  return (
    <TextField
      {...otherProps}
      label={label || 'Password'}
      value={password}
      type={visible ? 'text' : 'password'}
      onChange={(event) => {
        setPassword(event.target.value);
        onChange(event.target.value);
      }}
      error={!passwordRegex.test(password) && password.length > 0}
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
      }}
      helperText={
        <Stack spacing={1}>
          {uppercaseRegex.test(password) ? (
            <Typography
              color="success"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Done fontSize="inherit" color="inherit" />
              Atleast one uppercase character
            </Typography>
          ) : (
            <Typography
              color="error"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Close fontSize="inherit" color="inherit" />
              Atleast one uppercase character
            </Typography>
          )}
          {lowercaseRegex.test(password) ? (
            <Typography
              color="success"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Done fontSize="inherit" color="inherit" />
              Atleast one lowercase character
            </Typography>
          ) : (
            <Typography
              color="error"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Close fontSize="inherit" color="inherit" />
              Atleast one lowercase character
            </Typography>
          )}
          {specialCharRegex.test(password) ? (
            <Typography
              color="success"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Done fontSize="inherit" color="inherit" />
              Atleast one special character ({`@,#,!,$,%,^,&`})
            </Typography>
          ) : (
            <Typography
              color="error"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Close fontSize="inherit" color="inherit" />
              Atleast one special character ({`@,#,!,$,%,^,&`})
            </Typography>
          )}
          {numberRegex.test(password) ? (
            <Typography
              color="success"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Done fontSize="inherit" color="inherit" />
              Atleast one digit
            </Typography>
          ) : (
            <Typography
              color="error"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Close fontSize="inherit" color="inherit" />
              Atleast one digit
            </Typography>
          )}
          {lengthRegex.test(password) ? (
            <Typography
              color="success"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Done fontSize="inherit" color="inherit" />
              Minimum 8 character length
            </Typography>
          ) : (
            <Typography
              color="error"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Close fontSize="inherit" color="inherit" />
              Minimum 8 character length
            </Typography>
          )}
        </Stack>
      }
    />
  );
};

export default Password;
