import { Menu, MenuItem } from '@mui/material';
import type { FC } from 'react';

interface IColumnData {
  name: string;
  url: string;
}

interface MoreMenuProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onClose: () => void;
  columns?: IColumnData[];
}

const MoreMenu: FC<MoreMenuProps> = ({ open, anchorEl, onClose }) => {
  return (
    <Menu variant="menu" open={open} anchorEl={anchorEl} onClose={onClose}>
      <MenuItem>Quickstart</MenuItem>
      <MenuItem>Settings</MenuItem>
      <MenuItem>Credentials</MenuItem>
    </Menu>
  );
};

export default MoreMenu;
