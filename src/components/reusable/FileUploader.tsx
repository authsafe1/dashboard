import { AttachFile } from '@mui/icons-material';
import { InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { FC } from 'react';

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
        input: {
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
