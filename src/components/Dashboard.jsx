import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Badge,
  Collapse,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Science as ScienceIcon,
  Description as DocumentIcon,
  Settings as SettingsIcon,
  BarChart as AnalyticsIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  ExpandMore,
  ExpandLess,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  Build as OperationsIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({
    studies: false,
    documents: false,
    operations: false,
  });

  const handleMenuClick = (menu) => {
    setOpenMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isSelected = (path) => location.pathname === path;
  const isMenuOpen = (menu) => location.pathname.startsWith(`/${menu}`);

  const drawerWidth = 280;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#f8f9fa',
            border: 'none',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        {/* Logo/Brand */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Typography variant="h6" sx={{ color: 'primary.main' }}>
            eTMF System
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Navigation Menu */}
        <List sx={{ pt: 2 }}>
          {/* Dashboard */}
          <ListItem 
            button 
            selected={isSelected('/dashboard')}
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 1 }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          {/* Studies */}
          <ListItem 
            button 
            onClick={() => handleMenuClick('studies')}
            sx={{ mb: 1 }}
          >
            <ListItemIcon>
              <ScienceIcon />
            </ListItemIcon>
            <ListItemText primary="Studies" />
            {openMenus.studies ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus.studies || isMenuOpen('studies')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem 
                button 
                sx={{ pl: 4 }}
                selected={isSelected('/studies/active')}
                onClick={() => navigate('/studies/active')}
              >
                <ListItemText primary="Active Studies" />
              </ListItem>
              <ListItem 
                button 
                sx={{ pl: 4 }}
                selected={isSelected('/studies/completed')}
                onClick={() => navigate('/studies/completed')}
              >
                <ListItemText primary="Completed Studies" />
              </ListItem>
            </List>
          </Collapse>

          {/* Documents */}
          <ListItem 
            button 
            onClick={() => handleMenuClick('documents')}
            sx={{ mb: 1 }}
          >
            <ListItemIcon>
              <DocumentIcon />
            </ListItemIcon>
            <ListItemText primary="Documents" />
            {openMenus.documents ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus.documents || isMenuOpen('documents')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem 
                button 
                sx={{ pl: 4 }}
                selected={isSelected('/documents/recent')}
                onClick={() => navigate('/documents/recent')}
              >
                <ListItemText primary="Recent Documents" />
              </ListItem>
              <ListItem 
                button 
                sx={{ pl: 4 }}
                selected={isSelected('/documents/templates')}
                onClick={() => navigate('/documents/templates')}
              >
                <ListItemText primary="Templates" />
              </ListItem>
            </List>
          </Collapse>

          {/* Operations */}
          <ListItem 
            button 
            onClick={() => handleMenuClick('operations')}
            sx={{ mb: 1 }}
          >
            <ListItemIcon>
              <OperationsIcon />
            </ListItemIcon>
            <ListItemText primary="Operations" />
            {openMenus.operations ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openMenus.operations || isMenuOpen('operations')} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem 
                button 
                sx={{ pl: 4 }}
                selected={isSelected('/operations/workflows')}
                onClick={() => navigate('/operations/workflows')}
              >
                <ListItemText primary="Workflows" />
              </ListItem>
              <ListItem 
                button 
                sx={{ pl: 4 }}
                selected={isSelected('/operations/tasks')}
                onClick={() => navigate('/operations/tasks')}
              >
                <ListItemText primary="Tasks" />
              </ListItem>
            </List>
          </Collapse>

          {/* Reports & Analytics */}
          <ListItem 
            button 
            selected={isSelected('/reports')}
            onClick={() => navigate('/reports')}
            sx={{ mb: 1 }}
          >
            <ListItemIcon>
              <AnalyticsIcon />
            </ListItemIcon>
            <ListItemText primary="Reports & Analytics" />
          </ListItem>

          {/* Settings */}
          <ListItem 
            button 
            selected={isSelected('/settings')}
            onClick={() => navigate('/settings')}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 0, bgcolor: '#f5f6f8', height: '100vh', overflow: 'auto' }}>
        {/* Header */}
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Toolbar>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Avatar sx={{ ml: 2 }}>JD</Avatar>
          </Toolbar>
        </AppBar>

        {/* Page Content - This is where nested routes will render */}
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 