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
import { useNavigate } from 'react-router-dom';
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
  const [sections, setSections] = useState([]);
  // const [versionHistory, setVersionHistory] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [isGenerating, setIsGenerating] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Add Section dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedSectionTitle, setSelectedSectionTitle] = useState('');
  const [customSectionTitle, setCustomSectionTitle] = useState('');
  const [tabValue, setTabValue] = useState(0); // 0 for Template, 1 for Custom
  
  // Available section titles
  const availableSectionTitles = getAvailableSectionTitles();

  // Fetch sections on component mount
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setIsLoading(true);
        const fetchedSections = await documentEditorService.getAllSections();
        setSections(fetchedSections);
        console.log("Fetched sections:", fetchedSections);
        
      } catch (err) {
        console.error("Failed to fetch sections:", err);
        setError("Failed to load sections. Using local data instead.");
        // Fallback to local storage if API fails
        // setSections(getStoredSections());
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);


  const handleInputChange = async (_id, field, value) => {
    // Update local state immediately for responsive UI
    setSections(prevSections =>
      prevSections.map(section =>
        section._id === _id ? { ...section, [field]: value } : section
      )
    );
    
    // Debounced save to backend
    try {
      const section = sections.find(s => s._id === _id);
      if (section) {
        const updatedData = { ...section, [field]: value };
        await documentEditorService.updateSection(_id, {
          context: updatedData.context,
          prompt: updatedData.prompt,
          output: updatedData.output
        });
      }
    } catch (err) {
      console.error("Failed to update section:", err);
      // Consider showing a toast or notification here
    }
  };

  const handleExport = () => exportToWord(sections);

  
  const handleGenerateContent = async (_id) => {
    const section = sections.find((s) => s._id === _id);
    if (!section) return;
  
    // Set generating state for this specific section
    setIsGenerating(prev => ({...prev, [_id]: true}));
    
    try {
      // Generate content
      const generatedContent = await generateContent(section.prompt, section.context, section.output);
      
      // Update local state immediately
      setSections(prevSections =>
        prevSections.map(s =>
          s._id === _id ? { ...s, output: generatedContent } : s
        )
      );
      
      // Update backend
      try {
        await documentEditorService.updateSection(_id, {
          title: section.title,
          context: section.context,
          prompt: section.prompt,
          output: generatedContent
        });

        await documentEditorService.addNewVersion({
          sectionId: _id,
          title: section.title,
          context: section.context,
          prompt: section.prompt,
          output: generatedContent
        });
        
      } catch (updateErr) {
        console.error("Failed to update section in backend:", updateErr);
        // Keep the generated content in UI even if backend update fails
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
      setSections(prevSections =>
        prevSections.map(s =>
          s._id === _id ? { ...s, output: "Error generating content. Please try again." } : s
        )
      );
    } finally {
      // Clear generating state for this section
      setIsGenerating(prev => {
        const updated = {...prev};
        delete updated[_id];
        return updated;
      });
    }
  };
  
  const handleViewVersionHistory = (_id) => {
    // Navigate to version history page with section ID
    navigate(`/section-history/${_id}`);
  };
    
  const handleMenuOpen = (event, _id) => {
    setAnchorEl(event.currentTarget);
    setSelectedSectionId(_id);
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
  
  const handleAddSection = async () => {
    const title = tabValue === 0 ? selectedSectionTitle : customSectionTitle;
    
    if (!title) return;
    
    // Find the template for the selected title or create a basic one for custom title
    let newSection;
    
    if (tabValue === 1) { // Custom tab
      newSection = {
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
          // No need to generate an ID here, the backend will assign _id
        };
      } else {
        // Fallback if template not found
        newSection = {
          title: selectedSectionTitle,
          context: '',
          output: '',
          prompt: ''
        };
      }
    }
    
    try {
      // Show a loading indicator or disable the button while creating
      setIsLoading(true);
      
      // Create in backend first to get the assigned _id
      const createdSection = await documentEditorService.createSection(newSection);

      // console.log("Created section in backend:", createdSection.document);

      const createdSectionData = createdSection.document;
      // Add the new section with the backend-assigned _id to the local state
      const completeSection = {
        ...newSection,
        _id: createdSectionData._id,
        // Include any other properties that might come from the backend
      };
      
      setSections(prevSections => [...prevSections, completeSection]);
      
      // Close the dialog
      handleCloseAddDialog();
    } catch (err) {
      console.error("Failed to create section in backend:", err);
      // Consider showing a toast/notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {      
      // Clear existing sections first
      if (window.confirm('Are you sure you want to delete All sections?')) {
        await documentEditorService.deleteAllSections();
        setSections([]);
      } else {
        // Restore the section in the UI since user canceled
        const fetchedSections = await documentEditorService.getAllSections();
        setSections(fetchedSections);
      }     

    } catch (err) {
      console.error("Failed to reset sections:", err);
      // Fallback to local reset if backend fails
      const fetchedSections = await documentEditorService.getAllSections();
      setSections(fetchedSections);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteSection = async (_id) => {
    try {
      // Close the menu
      handleMenuClose();
      
      // Optimistically update UI first for better user experience
      setSections(prevSections => prevSections.filter(section => section._id !== _id));
      
      // Delete from backend

      if (window.confirm('Are you sure you want to delete this section?')) {
        await documentEditorService.deleteSection(_id);

      } else {
        // Restore the section in the UI since user canceled
        const fetchedSections = await documentEditorService.getAllSections();
        setSections(fetchedSections);
      }
      
   
    } catch (err) {
      console.error("Failed to delete section from backend:", err);
      // If backend delete fails, refetch all sections to restore correct state
      try {
        const fetchedSections = await documentEditorService.getAllSections();
        setSections(fetchedSections);
      } catch (fetchErr) {
        console.error("Failed to refetch sections after delete error:", fetchErr);
      }
    }
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
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

        {error && (
          <Box sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', mb: 2 }}>
            <Typography>{error}</Typography>
          </Box>
        )}

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
                <InputLabel id="section-select-label">Section Template</InputLabel>
                <Select
                  labelId="section-select-label"
                  value={selectedSectionTitle}
                  onChange={handleSectionTitleChange}
                  input={<OutlinedInput label="Section Template" />}
                  displayEmpty
                >
                  
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
            <Paper key={section._id} sx={{ mb: 3, p: 3, borderRadius: 2, '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' } }}>
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
                    onClick={() => handleViewVersionHistory(section._id)}
                  >
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More Options">
                  <IconButton size="small" onClick={(event) => handleMenuOpen(event, section._id)}>
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
                    value={section.context || ''}
                    onChange={(e) => handleInputChange(section._id, 'context', e.target.value)}
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
                    value={section.output || ''}
                    onChange={(e) => handleInputChange(section._id, 'output', e.target.value)}
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
                    value={section.prompt || ''}
                    onChange={(e) => handleInputChange(section._id, 'prompt', e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    fullWidth 
                    variant="contained" 
                    sx={{ mt: 2 }} 
                    disabled={isGenerating[section._id]}
                    onClick={() => handleGenerateContent(section._id)}
                  >
                    {isGenerating[section._id] ? <CircularProgress size={20} /> : 'Generate Content'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}><EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Section</MenuItem>
          <MenuItem onClick={() => handleDeleteSection(selectedSectionId)}>
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