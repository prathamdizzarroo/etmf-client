import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
  ThemeProvider,
  createTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  OutlinedInput,
  InputLabel,
  Tab,
  Tabs,
} from '@mui/material';
import {
  RestartAlt as ResetIcon,
  Save as SaveIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  History as HistoryIcon,
  Preview as PreviewIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { Document, Packer } from 'docx';
import { getPredefinedSections } from '../../constants/sectionData'; 
import { generateContent } from '../../services/AIService';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

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

// Retrieve stored sections from localStorage or initialize from predefined sections
const getStoredSections = () => {
  try {
    const storedData = localStorage.getItem('clinicalProtocolSections');
    if (storedData) {
      return JSON.parse(storedData);
    }
    return getPredefinedSections(); // Only load predefined sections if localStorage is empty
  } catch (error) {
    console.error("Failed to parse stored sections:", error);
    return getPredefinedSections(); // Fallback to predefined sections on error
  }
};

// Get version history from localStorage or initialize empty object
const getVersionHistory = () => {
  try {
    const storedHistory = localStorage.getItem('versionHistory');
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
    return {}; // Initialize empty object if no history exists
  } catch (error) {
    console.error("Failed to parse version history:", error);
    return {}; // Fallback to empty object on error
  }
};

// Get all available section titles from predefined sections
const getAvailableSectionTitles = () => {
  const predefinedSections = getPredefinedSections();
  return predefinedSections.map(section => section.title);
};

const exportToWord = async (sections) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections.map(section => ({
        text: `${section.title}\n\n${section.output || 'No content generated'}\n\n`,
      })),
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'clinical-trial-protocol.docx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const DocumentEditor = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState(getStoredSections());
  const [versionHistory, setVersionHistory] = useState(getVersionHistory());
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // State for Add Section dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedSectionTitle, setSelectedSectionTitle] = useState('');
  const [customSectionTitle, setCustomSectionTitle] = useState('');
  const [tabValue, setTabValue] = useState(0); // 0 for Template, 1 for Custom
  
  // Available section titles
  const availableSectionTitles = getAvailableSectionTitles();

  useEffect(() => {
    localStorage.setItem('clinicalProtocolSections', JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem('versionHistory', JSON.stringify(versionHistory));
  }, [versionHistory]);

  const handleInputChange = (id, field, value) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const handleExport = () => exportToWord(sections);

  // Add new version to history when content is generated
  const addVersionToHistory = (sectionId, title, context, prompt, output) => {
    const timestamp = new Date().toISOString();
    const versionNumber = versionHistory[sectionId] ? versionHistory[sectionId].length + 1 : 1;
    
    const newVersion = {
      version: versionNumber,
      timestamp,
      context,
      prompt,
      output,
    };
    
    setVersionHistory(prevHistory => {
      // Create a new object to ensure state update
      const updatedHistory = { ...prevHistory };
      
      // Initialize array for this section if it doesn't exist
      if (!updatedHistory[sectionId]) {
        updatedHistory[sectionId] = [];
      }
      
      // Add new version
      updatedHistory[sectionId] = [...updatedHistory[sectionId], newVersion];
      
      return updatedHistory;
    });
  };

  const handleGenerateContent = async (id) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
  
    try {
      setIsGenerating(true);
      const generatedContent = await generateContent(section.prompt, section.context, section.output);
      setIsGenerating(false);
      // Add this version to history before updating the section
      addVersionToHistory(
        section.id, 
        section.title,
        section.context,
        section.prompt,
        generatedContent
      );
      
      // Update the section with new content
      setSections(prevSections =>
        prevSections.map(s =>
          s.id === id ? { ...s, output: generatedContent } : s
        )
      );
    } catch (error) {
      console.error("Failed to generate content:", error);
      setSections(prevSections =>
        prevSections.map(s =>
          s.id === id ? { ...s, output: "Error generating content. Please try again." } : s
        )
      );
    }
  };
  
  const handleViewVersionHistory = (sectionId) => {
    // Navigate to version history page with section ID
    navigate(`/section-history/${sectionId}`);
  };
    
  const handleMenuOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedSectionId(id);
  };
  
  const handleMenuClose = () => setAnchorEl(null);
  
  // Add Section dialog handlers
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
    setTabValue(0);
    setSelectedSectionTitle('');
    setCustomSectionTitle('');
  };
  
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedSectionTitle('');
    setCustomSectionTitle('');
    setTabValue(0);
  };
  
  const handleSectionTitleChange = (event) => {
    setSelectedSectionTitle(event.target.value);
  };
  
  const handleCustomTitleChange = (event) => {
    setCustomSectionTitle(event.target.value);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // Reset fields when switching tabs
    if (newValue === 0) {
      setCustomSectionTitle('');
    } else {
      setSelectedSectionTitle('');
    }
  };
  
  const handleAddSection = () => {
    const title = tabValue === 0 ? selectedSectionTitle : customSectionTitle;
    
    if (!title) return;
    
    // Find the template for the selected title or create a basic one for custom title
    let newSection;
    
    if (tabValue === 1) { // Custom tab
      newSection = {
        id: uuidv4(),
        title: customSectionTitle,
        context: '',
        output: '',
        prompt: ''
      };
    } else { // Template tab
      // Find the predefined section template
      const predefinedSections = getPredefinedSections();
      const templateSection = predefinedSections.find(s => s.title === selectedSectionTitle);
      
      if (templateSection) {
        newSection = {
          ...templateSection,
          id: uuidv4(), // Always generate a new ID
        };
      } else {
        // Fallback if template not found
        newSection = {
          id: uuidv4(),
          title: selectedSectionTitle,
          context: '',
          output: '',
          prompt: ''
        };
      }
    }
    
    // Add the new section to the list
    setSections(prevSections => [...prevSections, newSection]);
    
    // Close the dialog
    handleCloseAddDialog();
  };

  const handleReset = () => {
    const defaultSections = getPredefinedSections();
    setSections(defaultSections);
    localStorage.setItem('clinicalProtocolSections', JSON.stringify(defaultSections));
    
    // Reset version history as well
    setVersionHistory({});
    localStorage.setItem('versionHistory', JSON.stringify({}));
  };
  
  const handleDeleteSection = (id) => {
    const updatedSections = sections.filter((section) => section.id !== id);
    setSections(updatedSections);
    localStorage.setItem('clinicalProtocolSections', JSON.stringify(updatedSections));
    
    // Also delete version history for this section
    const updatedHistory = { ...versionHistory };
    delete updatedHistory[id];
    setVersionHistory(updatedHistory);
    localStorage.setItem('versionHistory', JSON.stringify(updatedHistory));
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100%', bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" color="default" elevation={2}>
          <Toolbar sx={{ minHeight: 64 }}>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
              Clinical Trial Protocol Editor
            </Typography>
            <Tooltip title="Reset to Template">
              <Button startIcon={<ResetIcon />} onClick={handleReset}>
                Reset
              </Button>
            </Tooltip>
            <Tooltip title="Save Changes">
              <Button startIcon={<SaveIcon />}>Save</Button>
            </Tooltip>
            <Tooltip title="Add New Section">
              <Button 
                startIcon={<AddIcon />} 
                sx={{ mx: 1 }}
                onClick={handleOpenAddDialog}
              >
                Add Section
              </Button>
            </Tooltip>
            <Tooltip title="Preview Document">
              <Button startIcon={<PreviewIcon />} sx={{ mx: 1 }}>Preview</Button>
            </Tooltip>
            <Tooltip title="Export to Word">
              <Button startIcon={<ExportIcon />} variant="contained" onClick={handleExport}>
                Export
              </Button>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Add Section Dialog */}
        <Dialog 
          open={openAddDialog} 
          onClose={handleCloseAddDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              maxWidth: 500,
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            pb: 1
          }}>
            <Typography variant="h6">Add New Section</Typography>
            <IconButton onClick={handleCloseAddDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 2, pb: 1, px: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Template" sx={{ textTransform: 'none' }} />
              <Tab label="Custom" sx={{ textTransform: 'none' }} />
            </Tabs>
            
            {tabValue === 0 ? (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="section-select-label"></InputLabel>
                <Select
                  labelId="section-select-label"
                  value={selectedSectionTitle}
                  onChange={handleSectionTitleChange}
                  input={<OutlinedInput label="Section Template" />}
                  displayEmpty
                >
                  <MenuItem disabled value="">
                    <em>Select a section template</em>
                  </MenuItem>
                  {availableSectionTitles.map((title) => (
                    <MenuItem key={title} value={title}>
                      {title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                label="Custom Section Title"
                value={customSectionTitle}
                onChange={handleCustomTitleChange}
                sx={{ mb: 2 }}
                variant="outlined"
                placeholder="Enter a title for your custom section"
              />
            )}
          </DialogContent>
          
          <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Button 
              onClick={handleCloseAddDialog} 
              variant="outlined"
              sx={{ borderRadius: 1 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddSection}
              variant="contained"
              disabled={tabValue === 0 ? !selectedSectionTitle : !customSectionTitle}
              sx={{ ml: 1, borderRadius: 1 }}
            >
              Add Section
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ p: 1 }}>
          {sections && sections.map((section) => (
            <Paper key={section.id} sx={{ mb: 3, p: 3, borderRadius: 2, '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' } }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 400, color: 'primary.main' }}>
                  Section: {section.title}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title="Copy Section">
                  <IconButton size="small"><CopyIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Version History">
                  <IconButton 
                    size="small" 
                    onClick={() => handleViewVersionHistory(section.id)}
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More Options">
                  <IconButton size="small" onClick={(event) => handleMenuOpen(event, section.id)}>
                    <MoreIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>Context</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    value={section.context}
                    onChange={(e) => handleInputChange(section.id, 'context', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>Generated Content</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    value={section.output}
                    onChange={(e) => handleInputChange(section.id, 'output', e.target.value)}
                    variant="outlined"
                    size="small"
                    placeholder="AI-generated content will appear here..."
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>Prompt</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={10}
                    value={section.prompt}
                    onChange={(e) => handleInputChange(section.id, 'prompt', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    fullWidth 
                    variant="contained" 
                    sx={{ mt: 2 }} 
                    disabled={isGenerating}
                    onClick={() => handleGenerateContent(section.id)}
                  >
                    {isGenerating ? <CircularProgress size={20} /> : 'Generate Content'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}><EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Section</MenuItem>
          <MenuItem onClick={() => { handleDeleteSection(selectedSectionId); handleMenuClose(); }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Section
          </MenuItem>

          <Divider />
          <MenuItem onClick={() => { handleViewVersionHistory(selectedSectionId); handleMenuClose(); }}>
            <HistoryIcon fontSize="small" sx={{ mr: 1 }} /> View History
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
};

export default DocumentEditor;