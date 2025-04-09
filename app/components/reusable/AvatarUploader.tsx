import PhotoCameraOutlined from '@mui/icons-material/PhotoCameraOutlined';
import { Box, type BoxProps, CircularProgress } from '@mui/material';
import React, { useRef, useState } from 'react';
import ProfileAvatar from '~/components/ui/ProfileAvatar';

interface FileUploaderProps {
  image?: string;
  name?: string;
  loading?: boolean;
  onFileSelect: (file: File) => void;
  sx?: BoxProps['sx'];
}

const AvatarUploader: React.FC<FileUploaderProps> = ({
  image,
  name,
  loading,
  onFileSelect,
  sx,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const InputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const toggleHover = (hoverState: boolean) => () => setIsHovered(hoverState);

  return (
    <Box
      position="relative"
      onMouseEnter={toggleHover(true)}
      onMouseLeave={toggleHover(false)}
      sx={sx}
    >
      <ProfileAvatar
        url={image}
        name={name}
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          cursor: 'pointer',
        }}
      />
      {isHovered && !loading && (
        <>
          <Box
            onClick={() => InputRef.current?.click()}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0, 0, 0, 0.6)',
              color: '#fff',
              zIndex: 1,
              borderRadius: '50%',
              cursor: 'pointer',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            <PhotoCameraOutlined />
          </Box>
          <input
            ref={InputRef}
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </>
      )}
      {loading && (
        <Box
          onClick={() => InputRef.current?.click()}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            zIndex: 1,
            borderRadius: '50%',
          }}
        >
          <CircularProgress size={25} color="inherit" />
        </Box>
      )}
    </Box>
  );
};

export default AvatarUploader;
