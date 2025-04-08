import { AttachFile } from '@mui/icons-material';
import { InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import type { FC } from 'react';

type FileUploaderProps = TextFieldProps & {
  accept: string;
  label?: string;
  onFileSelect?: (file: File | null) => void;
};

const FileUploader: FC<FileUploaderProps> = ({
  accept,
  onFileSelect,
  ...props
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <TextField
      {...props}
      type="file"
      onChange={handleFileChange}
      slotProps={{
        ...props.slotProps,
        input: {
          ...props.slotProps?.input,
          startAdornment: (
            <InputAdornment position="start">
              <AttachFile />
            </InputAdornment>
          ),
          slotProps: {
            input: {
              accept,
            },
          },
        },
      }}
    />
  );
};

export default FileUploader;
