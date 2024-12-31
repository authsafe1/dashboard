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

const hasRotation = (
  props: SecretManagerProps,
): props is SecretManagerWithRotationProps => props.rotateFunc;

const SecretManager: React.FC<SecretManagerProps> = (props) => {
  const {
    copyFunc,
    visibilityFunc,
    rotateFunc,
    loading,
    onRotate,
    ...textFieldProps
  } = props as SecretManagerWithRotationProps;
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
              {rotateFunc &&
              hasRotation({
                copyFunc,
                visibilityFunc,
                rotateFunc,
                loading,
                onRotate,
                ...textFieldProps,
              }) ? (
                loading ? (
                  <Refresh
                    sx={{
                      animation: loading ? 'rotate 1s linear infinite' : 'none',
                      '@keyframes rotate': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                ) : (
                  <GeneralTooltip title="Rotate" arrow>
                    <IconButton onClick={onRotate}>
                      <Refresh
                        sx={{
                          animation: loading
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
              {visibilityFunc ? (
                <GeneralTooltip title="Reveal" arrow>
                  <IconButton onClick={() => setVisible(!visible)}>
                    {visible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </GeneralTooltip>
              ) : null}
              {copyFunc ? (
                <GeneralTooltip title="Copy" arrow>
                  <IconButton
                    onClick={() => handleCopy(textFieldProps.value as string)}
                  >
                    {copied ? <CheckCircle color="success" /> : <ContentCopy />}
                  </IconButton>
                </GeneralTooltip>
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
