// File: src/components/SidebarLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Button,
  Stack,
  IconButton,
  AppBar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddBoxIcon from '@mui/icons-material/AddBox';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const moduleMenus = {
  itam: [
    { label: 'Dashboard', path: '/itam/dashboard', icon: <DashboardIcon /> },
    { label: 'Asset List', path: '/itam/assets', icon: <ListAltIcon /> },
    { label: 'New Asset', path: '/itam/assets/new', icon: <AddBoxIcon /> },
  ],
  crm: [
    { label: 'Dashboard', path: '/crm/dashboard', icon: <DashboardIcon /> },
    { label: 'Clients', path: '/crm/clients', icon: <ListAltIcon /> },
    { label: 'Leads', path: '/crm/leads', icon: <AddBoxIcon /> },
  ],
  hrms: [
    { label: 'Dashboard', path: '/hrms/dashboard', icon: <DashboardIcon /> },
    { label: 'Employees', path: '/hrms/employees', icon: <ListAltIcon /> },
    { label: 'Add Employee', path: '/hrms/employees/new', icon: <AddBoxIcon /> },
  ],
};

const SidebarLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const moduleKey = location.pathname.split('/')[1];
  const menus = moduleMenus[moduleKey] || [];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box>
        <Toolbar>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar>{(user.name || 'U')[0]}</Avatar>
            <Box>
              <Typography variant="subtitle1">{user.name || 'User'}</Typography>
              <Typography variant="caption" color="text.secondary">{user.email || 'user@example.com'}</Typography>
            </Box>
          </Stack>
        </Toolbar>
        <Divider />
        <List>
          {menus.map((item, index) => (
            <ListItem
              key={index}
              button
              component={NavLink}
              to={item.path}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          color="error"
          fullWidth
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Project Inspiron
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        {isMobile && <Toolbar />}
        <Outlet />
      </Box>
    </Box>
  );
};

export default SidebarLayout;
