import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import TodayIcon from '@mui/icons-material/Today';
import { useMediaQuery, useTheme } from '@mui/material';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';

import { userStore } from '../../stores/UserStore';

const DRAWER_WIDTH = 240;

export const Layout = observer(() => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    userStore.logout();
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const goToTodaysJournal = () => {
    const today = new Date().toISOString().split('T')[0];
    navigate(`/journal/${today}`);
    if (isMobile) setMobileOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List>
        <ListItem>
          <ListItemButton onClick={() => handleNavigation('/')}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Panel główny" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={goToTodaysJournal}>
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText primary="Dzisiejszy dziennik" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => handleNavigation('/journal')}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary="Wszystkie wpisy" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={() => handleNavigation('/settings')}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Ustawienia" />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ marginTop: 'auto', p: 2 }}>
        <ListItem disablePadding>
          {userStore.isLoggedIn ? (
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Wyloguj" />
            </ListItemButton>
          ) : (
            <ListItemButton onClick={handleLogin}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Zaloguj" />
            </ListItemButton>
          )}
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          display: { sm: 'none' },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="otwórz menu"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Sleep Saver
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
        {/* Menu mobilne */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Lepsze działanie na urządzeniach mobilnych
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Menu desktopowe */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              position: 'relative',
              height: '100vh',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: { xs: '64px', sm: 0 }, // Dodaj margines górny dla widoku mobilnego
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
});
