import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Divider,
  useMediaQuery,
  Paper,
  Breadcrumbs,
  Link,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  InputBase,
  alpha,
  Button,
  ListItemButton,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Description,
  Assessment,
  Settings,
  Notifications as NotificationsIcon,
  AccountCircle,
  Search as SearchIcon,
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  Science as ScienceIcon,
  Assignment as AssignmentIcon,
  LocalHospital as LocalHospitalIcon,
  Logout as LogoutIcon,
  Help as HelpIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  NavigateNext as NavigateNextIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Create a custom theme for enterprise look
const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#9a0036',
    },
    background: {
      default: mode === 'light' ? '#f5f7fa' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#2c3e50' : '#e0e0e0',
      secondary: mode === 'light' ? '#7f8c8d' : '#a0a0a0',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '0.875rem',
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.75rem',
      letterSpacing: '0.00714em',
    },
    body1: {
      fontWeight: 400,
      fontSize: '0.875rem',
      letterSpacing: '0.00938em',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.75rem',
      letterSpacing: '0.01071em',
    },
    button: {
      fontWeight: 500,
      fontSize: '0.875rem',
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      letterSpacing: '0.03333em',
    },
    overline: {
      fontWeight: 400,
      fontSize: '0.625rem',
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        html, body {
          font-family: "Inter", "SF Pro Display", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light' 
            ? '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.07)'
            : '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'light'
            ? '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.07)'
            : '0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.12)',
        },
        elevation1: {
          boxShadow: mode === 'light'
            ? '0 2px 4px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.07)'
            : '0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: alpha('#1976d2', mode === 'light' ? 0.12 : 0.24),
            '&:hover': {
              backgroundColor: alpha('#1976d2', mode === 'light' ? 0.18 : 0.3),
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: '-0.01em',
        },
      },
    },
  },
});

const drawerWidth = 260;

const MainLayout = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('theme') || 'light');
  const theme = React.useMemo(() => getTheme(mode), [mode]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Toggle theme mode
  const toggleThemeMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  };

  // Handle profile menu
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle notification menu
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  // Toggle submenu
  const handleToggleSubMenu = (id) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Check if a route is active
  const isRouteActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Get current page title
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    
    // Handle all possible routes
    if (path === '/') return 'Dashboard';
    if(path.startsWith('/clinical-intake')) return 'Clinical Intake';
    if (path.startsWith('/documents')) return 'Documents';
    if (path.startsWith('/document-')) return 'Documents';
    if (path.startsWith('/studies')) return 'Studies';
    if (path.startsWith('/study-protocols')) return 'Study Protocols';
    if (path.startsWith('/clinical-trials')) return 'Clinical Trials';
    if (path.startsWith('/operations')) return 'Operations';
    if (path.startsWith('/reports')) return 'Reports';
    if (path.startsWith('/settings')) return 'Settings';
    
    // Extract title from path as fallback
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      return segments[0]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    return 'eTMF System';
  };

  // Menu structure with nested items
  const menuItems = [
    {
      id: 'clinical-intake',
      text: 'Clinical Intake',
      icon: <Description />,
      path: '/clinical-intake',
    },
    { 
      id: 'dashboard',
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/' 
    },
    { 
      id: 'studies',
      text: 'Studies', 
      icon: <ScienceIcon />, 
      path: '/studies',
      subItems: [
        { text: 'Study Protocols', path: '/study-protocols' },
        { text: 'Clinical Trials', path: '/clinical-trials' },
        { text: 'Study Sites', path: '/study-sites' },
      ]
    },
    { 
      id: 'documents',
      text: 'Documents', 
      icon: <Description />, 
      path: '/documents',
      subItems: [
        { text: 'All Documents', path: '/documents' },
        { text: 'Templates', path: '/document-templates' },
        { text: 'Document Map', path: '/document-map' },
      ]
    },
    { 
      id: 'operations',
      text: 'Operations', 
      icon: <AssignmentIcon />, 
      path: '/operations',
      subItems: [
        { text: 'Site Management', path: '/site-management' },
        { text: 'Monitoring', path: '/monitoring' },
        { text: 'Regulatory', path: '/regulatory' },
      ]
    },
    { 
      id: 'reports',
      text: 'Reports & Analytics', 
      icon: <Assessment />, 
      path: '/reports' 
    },
    { 
      id: 'settings',
      text: 'Settings', 
      icon: <Settings />, 
      path: '/settings' 
    },
  ];

  // Update renderBreadcrumbs to handle all routes correctly
  const renderBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // Don't show breadcrumbs on home page
    if (pathSegments.length === 0) {
      return null;
    }
    
    return (
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3, mt: 1 }}
      >
        <Link 
          color="inherit" 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <DashboardIcon sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </Link>
        
        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          
          // Format the segment for display
          const formattedSegment = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          // Special case handling for IDs and numeric segments
          const isNumericOrId = /^\d+$/.test(segment) || segment.length > 20;
          
          if (isNumericOrId && !isLast) {
            // Skip numeric segments in the middle of the path
            return null;
          }
          
          if (isNumericOrId && isLast) {
            // For IDs at the end, show a more descriptive label
            const entityType = pathSegments[index - 1] || '';
            const label = entityType 
              ? `${entityType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Details`
              : 'Details';
              
            return (
              <Typography key={path} color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                {label}
              </Typography>
            );
          }
          
          return isLast ? (
            <Typography key={path} color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              {formattedSegment}
            </Typography>
          ) : (
            <Link
              key={path}
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(path);
              }}
            >
              {formattedSegment}
            </Link>
          );
        }).filter(Boolean)}
      </Breadcrumbs>
    );
  };

  // Drawer content
  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 1.5
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalHospitalIcon sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
            eTMF System
          </Typography>
        </Box>
      </Toolbar>
      
      <Divider />
      
      <Box sx={{ px: 2, py: 2 }}>
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 20,
            bgcolor: alpha(theme.palette.common.black, theme.palette.mode === 'light' ? 0.04 : 0.2),
          }}
        >
          <IconButton sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Paper>
      </Box>
      
      <List
        component="nav"
        sx={{ 
          width: '100%', 
          flex: 1,
          px: 1,
        }}
      >
        {menuItems.map((item) => (
          <React.Fragment key={item.id}>
            {item.subItems ? (
              <>
                <ListItemButton
                  onClick={() => handleToggleSubMenu(item.id)}
                  selected={isRouteActive(item.path)}
                  sx={{ mb: openSubMenus[item.id] ? 0 : 0.5 }}
                >
                  <ListItemIcon sx={{ color: isRouteActive(item.path) ? 'primary.main' : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: isRouteActive(item.path) ? 600 : 400,
                    }}
                  />
                  {openSubMenus[item.id] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openSubMenus[item.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.path}
                        sx={{ pl: 4 }}
                        selected={isRouteActive(subItem.path)}
                        onClick={() => {
                          navigate(subItem.path);
                          if (isSmallScreen) setMobileOpen(false);
                        }}
                      >
                        <ListItemText 
                          primary={subItem.text} 
                          primaryTypographyProps={{ 
                            fontSize: '0.875rem',
                            fontWeight: isRouteActive(subItem.path) ? 600 : 400,
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isSmallScreen) setMobileOpen(false);
                }}
                selected={isRouteActive(item.path)}
                sx={{ mb: 0.5 }}
              >
                <ListItemIcon sx={{ color: isRouteActive(item.path) ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: isRouteActive(item.path) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            )}
          </React.Fragment>
        ))}
      </List>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Need Help?
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, textAlign: 'center', fontSize: '0.8rem' }}>
            Access documentation and support resources
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<HelpIcon />}
            onClick={() => navigate('/help')}
            sx={{ borderRadius: 20 }}
          >
            Help Center
          </Button>
        </Paper>
      </Box>
    </Box>
  );

  // Profile menu
  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        elevation: 3,
        sx: { mt: 1, minWidth: 200 }
      }}
    >
      <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ width: 40, height: 40, mr: 1.5 }}>JD</Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>John Doe</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            Administrator
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />
      <MenuItem onClick={() => navigate('/profile')}>
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        <ListItemText>My Profile</ListItemText>
      </MenuItem>
      <MenuItem onClick={toggleThemeMode}>
        <ListItemIcon>
          {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText>{mode === 'light' ? 'Dark Mode' : 'Light Mode'}</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => navigate('/login')}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );

  // Notification menu
  const notificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      open={Boolean(notificationAnchorEl)}
      onClose={handleNotificationMenuClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      PaperProps={{
        elevation: 3,
        sx: { mt: 1, minWidth: 320, maxWidth: 320 }
      }}
    >
      <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Notifications</Typography>
        <Button size="small" sx={{ fontSize: '0.75rem' }}>Mark all as read</Button>
      </Box>
      <Divider />
      <MenuItem sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box sx={{ mr: 1.5, mt: 0.5 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
              <AssignmentIcon fontSize="small" />
            </Avatar>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              Protocol Update Required
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
              Study protocol TEST-001 needs review and approval
            </Typography>
            <Typography variant="caption" color="text.secondary">
              2 hours ago
            </Typography>
          </Box>
        </Box>
      </MenuItem>
      <Divider />
      <MenuItem sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box sx={{ mr: 1.5, mt: 0.5 }}>
            <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
              <Description fontSize="small" />
            </Avatar>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              Document Approved
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.5 }}>
              ICF Template v2.0 has been approved
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Yesterday
            </Typography>
          </Box>
        </Box>
      </MenuItem>
      <Divider />
      <Box sx={{ p: 1, textAlign: 'center' }}>
        <Button size="small" onClick={() => navigate('/notifications')}>
          View All Notifications
        </Button>
      </Box>
    </Menu>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: theme.palette.mode === 'light' ? 'white' : 'background.paper',
            color: 'text.primary',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
                {getCurrentPageTitle()}
              </Typography>
              <Chip 
                label="v1.2.0" 
                size="small" 
                sx={{ ml: 2, height: 20, fontSize: '0.65rem' }} 
                variant="outlined" 
              />
            </Box>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Notifications">
                <IconButton 
                  color="inherit" 
                  onClick={handleNotificationMenuOpen}
                  size="large"
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Theme">
                <IconButton 
                  color="inherit" 
                  onClick={toggleThemeMode}
                  size="large"
                  sx={{ ml: 1 }}
                >
                  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Account">
                <IconButton
                  edge="end"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  size="large"
                  sx={{ ml: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>JD</Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
        
        {profileMenu}
        {notificationMenu}
        
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                borderRight: '1px solid',
                borderColor: 'divider',
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
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}
        >
          <Toolbar />
          {renderBreadcrumbs()}
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout; 