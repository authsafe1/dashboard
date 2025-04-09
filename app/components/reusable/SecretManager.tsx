import CheckCircle from '@mui/icons-material/CheckCircle';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
  Tooltip,
} from '@mui/material';
import React, { useState } from 'react';

type SecretManagerProps = TextFieldProps & {
  copyFunc: boolean;
  visibilityFunc: boolean;
};

const SecretManager: React.FC<SecretManagerProps> = ({
  copyFunc,
  visibilityFunc,
  ...textFieldProps
}) => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (secret: string) => {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <TextField
      {...textFieldProps}
      type={visibilityFunc ? (visible ? 'text' : 'password') : 'text'}
      slotProps={{
        input: {
          ...textFieldProps.slotProps?.input,
          endAdornment: (
            <InputAdornment position="end">
              {visibilityFunc ? (
                <Tooltip title="Reveal" arrow>
                  <IconButton onClick={() => setVisible(!visible)}>
                    {visible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </Tooltip>
              ) : null}
              {copyFunc ? (
                <Tooltip title="Copy" arrow>
                  <IconButton
                    onClick={() => handleCopy(textFieldProps.value as string)}
                  >
                    {copied ? <CheckCircle color="success" /> : <ContentCopy />}
                  </IconButton>
                </Tooltip>
              ) : null}
            </InputAdornment>
          ),
          readOnly: true,
        },
      }}
    />
  );
};

export default SecretManager;
