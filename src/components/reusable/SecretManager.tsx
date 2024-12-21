import {
  CheckCircle,
  ContentCopy,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React, { useState } from "react";
import GeneralTooltip from "../reusable/GeneralTooltip";

type SecretManagerProps = TextFieldProps & {
  copyFunc: boolean;
  visibilityFunc: boolean;
};

const SecretManager: React.FC<SecretManagerProps> = ({
  copyFunc,
  visibilityFunc,
  value,
  ...props
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
      value={value}
      type={visibilityFunc ? (visible ? "text" : "password") : "text"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              {visibilityFunc ? (
                <GeneralTooltip title="Reveal" arrow>
                  <IconButton onClick={() => setVisible(!visible)}>
                    {visible ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </GeneralTooltip>
              ) : null}
              {copyFunc ? (
                <GeneralTooltip title="Copy" arrow>
                  <IconButton onClick={() => handleCopy(value as string)}>
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
