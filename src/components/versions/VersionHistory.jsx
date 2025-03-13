import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Tabs,
  Tab,
  Button,
  Grid,
  Tooltip,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

import documentEditorService from '../../services/documentEditor.service';

// Enterprise theme
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif' },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 500 } } },
    MuiPaper: { styleOverrides: { root: { boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } } },
  },
});

const VersionHistory = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [versionHistory, setVersionHistory] = useState([]);
  const [sectionTitle, setSectionTitle] = useState('');
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchVersionHistory = async () => {
      try {
        setLoading(true);
        
        const response = await documentEditorService.getAllVersions(sectionId);
        
        if (response.success && response.data) {
          setSectionTitle(response.data.title || 'Untitled Section');
          
          if (response.data.versions && response.data.versions.length > 0) {
            setVersionHistory(response.data.versions);
            // Select the latest version (highest version number)
            const latestVersion = [...response.data.versions].sort((a, b) => 
              b.versionNumber - a.versionNumber)[0];
            setSelectedVersion(latestVersion);
          } else {
            setVersionHistory([]);
          }
        } else {
          setVersionHistory([]);
        }
      } catch (err) {
        console.error("Failed to load version history:", err);
        setVersionHistory([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVersionHistory();
  }, [sectionId]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleVersionSelect = (version) => {
    setSelectedVersion(version);
  };
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Loading state
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ height: '100%', bgcolor: 'background.default', minHeight: '100vh' }}>
          <AppBar position="static" color="default" elevation={2}>
            <Toolbar sx={{ minHeight: 64 }}>
              <Tooltip title="Back to Editor">
                <IconButton 
                  edge="start" 
                  color="inherit" 
                  onClick={handleBack} 
                  sx={{ mr: 2 }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
                Version History
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
            <CircularProgress />
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
  
  
  // No history available
  if (versionHistory.length === 0) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ height: '100%', bgcolor: 'background.default', minHeight: '100vh' }}>
          <AppBar position="static" color="default" elevation={2}>
            <Toolbar sx={{ minHeight: 64 }}>
              <Tooltip title="Back to Editor">
                <IconButton 
                  edge="start" 
                  color="inherit" 
                  onClick={handleBack} 
                  sx={{ mr: 2 }}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
                Version History
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}>
            <Paper sx={{ p: 4, maxWidth: 600, textAlign: 'center' }}>
              <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No Version History Available
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                No versions have been generated for this section yet. Generate content to create version history.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<ArrowBackIcon />} 
                onClick={handleBack}
              >
                Return to Editor
              </Button>
            </Paper>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100%', bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" color="default" elevation={2}>
          <Toolbar sx={{ minHeight: 64 }}>
            <Tooltip title="Back to Editor">
              <IconButton 
                edge="start" 
                color="inherit" 
                onClick={handleBack} 
                sx={{ mr: 2 }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
              Version History: {sectionTitle}
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ borderRadius: 2, height: '100%' }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ p: 2, borderBottom: '1px solid #eee', fontWeight: 500 }}
                >
                  Versions
                </Typography>
                <List sx={{ p: 0 }}>
                  {versionHistory.map((version, index) => (
                    <ListItem 
                      key={version.versionNumber || index} 
                      disablePadding 
                      divider={index < versionHistory.length - 1}
                    >
                      <ListItemButton 
                        selected={selectedVersion && selectedVersion.versionNumber === version.versionNumber}
                        onClick={() => handleVersionSelect(version)}
                        sx={{ 
                          '&.Mui-selected': { 
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                          }
                        }}
                      >
                        <ListItemText 
                          primary={`Version ${version.versionNumber}`}
                          secondary={formatDate(version.createdAt)}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={9}>
              {selectedVersion && (
                <Paper sx={{ borderRadius: 2, p: 0, overflow: 'hidden' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                      value={currentTab} 
                      onChange={handleTabChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                    >
                      <Tab label="Generated Content" />
                      <Tab label="Prompt" />
                      <Tab label="Context" />
                    </Tabs>
                  </Box>
                  
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        {currentTab === 0 ? 'Generated Content' : currentTab === 1 ? 'Prompt' : 'Context'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Version {selectedVersion.versionNumber} • {formatDate(selectedVersion.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ whiteSpace: 'pre-wrap' }}>
                      {currentTab === 0 ? selectedVersion.output : 
                       currentTab === 1 ? selectedVersion.prompt : 
                       selectedVersion.context}
                    </Box>
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default VersionHistory;