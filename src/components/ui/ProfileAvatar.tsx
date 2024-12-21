import { Avatar, AvatarProps } from '@mui/material';
import { FC } from 'react';

interface IProfileAvatarProps {
  name?: string;
  url?: string;
  style?: AvatarProps['style'];
  sx?: Omit<AvatarProps['sx'], 'bgcolor'>;
}

const ProfileAvatar: FC<IProfileAvatarProps> = ({ name, url, style, sx }) => {
  const stringToColor = (string: string) => {
    let hash = 0;
    let i: number;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  const stringAvatar = (name: string) => {
    return {
      bgcolor: stringToColor(name),
      children: `${name[0]}`,
    };
  };

  return url ? (
    <Avatar src={url} style={style} alt={`${name} logo`} sx={sx} />
  ) : (
    <Avatar
      style={style}
      alt={`${name} logo`}
      children={stringAvatar(name as string).children}
      sx={{ bgcolor: stringAvatar(name as string).bgcolor, ...sx }}
    />
  );
};

export default ProfileAvatar;
