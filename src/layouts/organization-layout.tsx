import { Logout, MenuBook, Palette, Person } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  AppBar,
  Box,
  Collapse,
  Divider,
  Grid2 as Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  styled,
  Switch,
  Tab,
  Tabs,
  Toolbar,
  useTheme,
} from '@mui/material';
import { yellow } from '@mui/material/colors';
import { useRef, useState } from 'react';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useNavigation,
} from 'react-router';
import { AuthSafeIcon, ProfileAvatar, RouteLoader } from '../components';
import constants from '../config/constants';
import { useAuth } from '../context/AuthContext';
import { useThemeToggle } from '../context/ThemeContext';

const ToggleThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 55,
  height: 30,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: yellow[700],
    width: 27,
    height: 27,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const OrganizationLayout = () => {
  const location = useLocation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const defaultTheme = useTheme();

  const profileMenuAnchor = useRef<HTMLButtonElement | null>(null);

  const { profile, checkAuth } = useAuth();
  const { theme, toggleTheme } = useThemeToggle();

  const [alertOpen, setAlertOpen] = useState(!profile?.isVerified);

  const navigation = useNavigation();
  const loading = Boolean(navigation.location);

  const { organizationNavigation } = constants;

  const navigate = useNavigate();

  const handleProfileMenuOpen = () => {
    setProfileMenuOpen(true);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    try {
      fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      checkAuth();
      navigate('/auth/login', { replace: true });
    } catch {
      checkAuth();
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Menu
        anchorEl={profileMenuAnchor.current}
        open={profileMenuOpen}
        onClose={handleProfileMenuClose}
      >
        <ListItem>
          <ListItemAvatar>
            <ProfileAvatar url={profile?.photo} name={profile?.name} />
          </ListItemAvatar>
          <ListItemText primary={profile?.name} secondary={profile?.email} />
        </ListItem>
        <Divider />
        <ListItem sx={{ px: 3 }}>
          <ListItemIcon>
            <Palette />
          </ListItemIcon>
          <ListItemText
            primary="Theme"
            slotProps={{ primary: { variant: 'body2' } }}
          />
          <ToggleThemeSwitch
            checked={theme === 'dark'}
            onChange={() => toggleTheme()}
          />
        </ListItem>
        <Divider />
        <MenuItem component={Link} to="/profile">
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem component="a" href={import.meta.env.VITE_DOCS_URL}>
          <ListItemIcon>
            <MenuBook />
          </ListItemIcon>
          Documentation
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Log out
        </MenuItem>
      </Menu>
      <AppBar>
        <Toolbar>
          <Box flex={1}>
            <IconButton href={import.meta.env.VITE_BASE_URL}>
              <AuthSafeIcon
                theme={defaultTheme.palette.mode}
                fontSize="large"
              />
            </IconButton>
          </Box>
          <Box>
            <IconButton ref={profileMenuAnchor} onClick={handleProfileMenuOpen}>
              <ProfileAvatar
                name={profile?.name}
                url={profile?.photo}
                style={{ width: 30, height: 30 }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Box width="100%">
        <DrawerHeader />
        <Tabs variant="scrollable" value={location.pathname}>
          {organizationNavigation.map(({ to, text, Icon }, index) => (
            <Tab
              icon={<Icon />}
              key={`${text}-${index}`}
              label={text}
              iconPosition="start"
              onClick={() => {
                navigate(to);
              }}
              value={to.split('?')[0]}
            />
          ))}
        </Tabs>
        <Grid component="main" p={4}>
          <Box sx={{ width: '100%', mb: alertOpen ? 4 : 0 }}>
            <Collapse in={alertOpen} unmountOnExit>
              <Alert severity="warning" onClose={handleAlertClose}>
                <AlertTitle>{constants.unverifiedUserMessage.title}</AlertTitle>
                {constants.unverifiedUserMessage.subtitle}
              </Alert>
            </Collapse>
          </Box>
          {loading ? <RouteLoader /> : <Outlet />}
        </Grid>
      </Box>
    </Box>
  );
};

export default OrganizationLayout;
