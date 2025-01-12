import {
  ChevronLeft,
  KeyboardArrowDown,
  Logout,
  MenuBook,
  Menu as MenuIcon,
  Palette,
  Person,
  Settings,
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  Divider,
  Drawer,
  Grid2 as Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  styled,
  Switch,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { yellow } from '@mui/material/colors';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { AuthSafeIcon, ProfileAvatar } from './components';
import constants from './config/constants';
import { useAuth } from './context/AuthContext';
import { useOrganization } from './context/OrganizationContext';
import { useThemeToggle } from './context/ThemeContext';

const drawerWidth = 300;

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

const Main = styled(Grid, { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
        [theme.breakpoints.down('md')]: {
          marginLeft: `-${drawerWidth}px`,
        },
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        [theme.breakpoints.down('md')]: {
          width: '100%',
          marginLeft: 0,
        },
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const defaultTheme = useTheme();
  const isMobile = useMediaQuery(defaultTheme.breakpoints.down('md'));

  const profileMenuAnchor = useRef<HTMLButtonElement | null>(null);
  const organizationMenuAnchor = useRef<HTMLButtonElement | null>(null);

  const { profile, checkAuth } = useAuth();
  const { theme, toggleTheme } = useThemeToggle();

  const [alertOpen, setAlertOpen] = useState(!profile?.isVerified);
  const [organizationMenuOpen, setOrganizationMenuOpen] = useState(false);

  const { navigation } = constants;

  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileMenuOpen = () => {
    setProfileMenuOpen(true);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuOpen(false);
  };

  const handleOrganizationMenuOpen = () => {
    setOrganizationMenuOpen(true);
  };

  const handleOrganizationMenuClose = () => {
    setOrganizationMenuOpen(false);
  };

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    } else {
      setDrawerOpen(true);
    }
  }, [isMobile]);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
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

  const { organization } = useOrganization();

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
        <MenuItem component="a" href={`${import.meta.env.VITE_BASE_URL}/docs`}>
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
      <Menu
        anchorEl={organizationMenuAnchor.current}
        open={organizationMenuOpen}
        onClose={handleOrganizationMenuClose}
      >
        <ListItem>
          <ListItemAvatar>
            <ProfileAvatar name={organization?.name} />
          </ListItemAvatar>
          <ListItemText
            primary={organization?.name}
            secondary={organization?.domain}
          />
        </ListItem>
        <Divider />
        <MenuItem component={Link} to="/organizations">
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
      </Menu>
      <AppBar open={drawerOpen}>
        <Toolbar>
          <Box flex={1} gap={2}>
            <IconButton
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  mr: 1,
                },
                drawerOpen && { display: 'none' },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              href={import.meta.env.VITE_BASE_URL}
              sx={[drawerOpen && { display: 'none' }]}
            >
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
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        <DrawerHeader>
          <Box sx={{ m: 1 }}>
            <IconButton href={import.meta.env.VITE_BASE_URL}>
              <AuthSafeIcon theme={theme} fontSize="large" />
            </IconButton>
          </Box>
          <Button
            ref={organizationMenuAnchor}
            id="organization-menu-button"
            aria-controls={
              organizationMenuOpen ? 'ororganization-menu' : undefined
            }
            aria-haspopup="true"
            aria-expanded={organizationMenuOpen ? 'true' : undefined}
            variant="outlined"
            fullWidth
            onClick={handleOrganizationMenuOpen}
            endIcon={<KeyboardArrowDown />}
          >
            {organization?.name}
          </Button>
          <Box sx={{ m: 1 }}>
            <IconButton onClick={handleDrawerClose} color="inherit">
              <ChevronLeft />
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
        {navigation.map(({ subheader, routes }, indexTop) => (
          <Fragment key={`list-header-${indexTop}`}>
            <List dense subheader={<ListSubheader>{subheader}</ListSubheader>}>
              {routes.map(({ to, text, Icon }, indexBottom) => (
                <ListItemButton
                  key={`list-button-${indexBottom}`}
                  onClick={() => navigate(to)}
                  selected={location.pathname === to.split('?')[0]}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              ))}
            </List>
            <Divider />
          </Fragment>
        ))}
      </Drawer>
      <Main container open={drawerOpen}>
        <DrawerHeader />
        <Box sx={{ width: '100%', mb: alertOpen ? 4 : 0 }}>
          <Collapse in={alertOpen} unmountOnExit>
            <Alert severity="warning" onClose={handleAlertClose}>
              <AlertTitle>{constants.unverifiedUserMessage.title}</AlertTitle>
              {constants.unverifiedUserMessage.subtitle}
            </Alert>
          </Collapse>
        </Box>
        <Outlet />
      </Main>
    </Box>
  );
};

export default DashboardLayout;
