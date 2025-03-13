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

  const renderLeftNav = () => (
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
              <ListItemText 
                primary="Active Studies" 
                secondary={
                  <Chip 
                    label="12" 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 1 }} 
                  />
                }
              />
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

      {/* Help Section */}
      <Box sx={{ 
        p: 2, 
        mt: 'auto', 
        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        bgcolor: '#f1f5f9'
      }}>
        <Typography variant="subtitle2" gutterBottom>
          Need Help?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Access documentation and support resources.
        </Typography>
        <Chip 
          label="Help Center" 
          color="primary" 
          variant="outlined" 
          size="small" 
          clickable
        />
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Header */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'white',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 0, mr: 2 }}>
            eTMF
          </Typography>
          <Chip 
            label="v1.2.0" 
            size="small" 
            sx={{ 
              bgcolor: 'primary.light',
              color: 'primary.main',
              mr: 4
            }} 
          />
          <Box sx={{ flexGrow: 1 }} />
          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              JD
            </Avatar>
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              John Doe
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Left Navigation */}
      {renderLeftNav()}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          bgcolor: '#f8fafc',
          height: 'calc(100vh - 64px)',
          overflow: 'auto'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard; 