import {
  CheckCircle,
  ContentCopy,
  Refresh,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import React, { useState } from 'react';
import GeneralTooltip from '../reusable/GeneralTooltip';

type SecretManagerWithRotationProps = TextFieldProps & {
  copyFunc: boolean;
  visibilityFunc: boolean;
  rotateFunc: true;
  onRotate: () => Promise<void>;
  loading: boolean;
};

type SecretManagerWithoutRotationProps = TextFieldProps & {
  rotateFunc: false;
  copyFunc: boolean;
  visibilityFunc: boolean;
};

type SecretManagerProps =
  | SecretManagerWithRotationProps
  | SecretManagerWithoutRotationProps;

const SecretManager: React.FC<SecretManagerProps> = (props) => {
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
      value={props.value}
      type={props.visibilityFunc ? (visible ? 'text' : 'password') : 'text'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              {props.rotateFunc ? (
                props.loading ? (
                  <Refresh
                    sx={{
                      animation: props.loading
                        ? 'rotate 1s linear infinite'
                        : 'none',
                      '@keyframes rotate': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                ) : (
                  <GeneralTooltip title="Rotate" arrow>
                    <IconButton onClick={props.onRotate}>
                      <Refresh
                        sx={{
                          animation: props.loading
                            ? 'rotate 1s linear infinite'
                            : 'none',
                          '@keyframes rotate': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                          },
                        }}
                      />
                    </IconButton>
                  </GeneralTooltip>
                )
              ) : null}
              {props.visibilityFunc ? (
                <GeneralTooltip title="Reveal" arrow>
                  <IconButton onClick={() => setVisible(!visible)}>
                    {visible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </GeneralTooltip>
              ) : null}
              {props.copyFunc ? (
                <GeneralTooltip title="Copy" arrow>
                  <IconButton onClick={() => handleCopy(props.value as string)}>
                    {copied ? <CheckCircle color="success" /> : <ContentCopy />}
                  </IconButton>
                </GeneralTooltip>
              ) : null}
            </InputAdornment>
          ),
          readOnly: true,
        },
      }}
      {...props}
    />
  );
};

export default SecretManager;
