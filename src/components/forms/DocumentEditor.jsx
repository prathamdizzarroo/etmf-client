import React, { useState } from 'react';
import {
  Box,
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
} from '@mui/icons-material';
import { Document, Packer } from 'docx';

// Enterprise theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#4791db',
      dark: '#115293',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

const protocolSections = [
  {
    id: 1,
    title: 'PROTOCOL SUMMARY',
    context: 'This section should provide a concise overview of the entire clinical trial protocol...',
    prompt: 'Write a comprehensive protocol summary...',
  },
  {
    id: 2,
    title: 'INTRODUCTION',
    context: 'This section should cover the purpose of the trial...',
    prompt: 'Write an introduction for a clinical trial protocol...',
  },
  {
    id: 3,
    title: 'STUDY OBJECTIVES',
    context: 'Define primary and secondary objectives of the trial...',
    prompt: 'List the primary and secondary objectives...',
  },
  {
    id: 4,
    title: 'METHODOLOGY',
    context: 'Detailed description of study design and procedures...',
    prompt: 'Describe the study methodology...',
  },
  {
    id: 5,
    title: 'STATISTICAL ANALYSIS',
    context: 'Statistical methods and analysis plan...',
    prompt: 'Detail the statistical analysis plan...',
  },
  // Add more sections as needed
];

const exportToWord = async (sections) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections.map(section => ({
        text: `${section.title}\n\n${section.generatedContent || 'No content generated'}\n\n`,
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

const DocumentEditor = ({ onSubmit, initialData }) => {
  const [sections, setSections] = useState(protocolSections.map(section => ({
    ...section,
    generatedContent: '',
  })));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleExport = () => {
    exportToWord(sections);
  };

  const handleGenerateContent = async (sectionId) => {
    // Placeholder for AI integration
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const dummyResponse = `AI-generated content for ${section.title}...`;
      const updatedSections = sections.map(s => 
        s.id === sectionId ? { ...s, generatedContent: dummyResponse } : s
      );
      setSections(updatedSections);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100%', bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Enhanced Toolbar */}
        <AppBar position="static" color="default" elevation={2}>
          <Toolbar sx={{ minHeight: 64 }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
              Clinical Trial Protocol Editor
            </Typography>
            <Tooltip title="Reset to Template">
              <Button startIcon={<ResetIcon />} sx={{ mx: 1 }}>
                Reset
              </Button>
            </Tooltip>
            <Tooltip title="Save Changes">
              <Button startIcon={<SaveIcon />} sx={{ mx: 1 }}>
                Save
              </Button>
            </Tooltip>
            <Tooltip title="Add New Section">
              <Button startIcon={<AddIcon />} sx={{ mx: 1 }}>
                Add Section
              </Button>
            </Tooltip>
            <Tooltip title="Preview Document">
              <Button startIcon={<PreviewIcon />} sx={{ mx: 1 }}>
                Preview
              </Button>
            </Tooltip>
            <Tooltip title="Export to Word">
              <Button 
                startIcon={<ExportIcon />}
                variant="contained"
                onClick={handleExport}
                sx={{ mx: 1 }}
              >
                Export
              </Button>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ p: 3 }}>
          {sections.map((section) => (
            <Paper 
              key={section.id} 
              sx={{ 
                mb: 3, 
                p: 3,
                borderRadius: 2,
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                pb: 1
              }}>
                <Typography variant="h6" sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 500,
                  color: 'primary.main'
                }}>
                  Section {section.id}: {section.title}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title="Copy Section">
                  <IconButton size="small">
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Version History">
                  <IconButton size="small">
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More Options">
                  <IconButton 
                    size="small"
                    onClick={handleMenuOpen}
                  >
                    <MoreIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                    Context
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={section.context}
                    variant="outlined"
                    size="small"
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                    Generated Content
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={section.generatedContent}
                    variant="outlined"
                    size="small"
                    placeholder="AI-generated content will appear here..."
                    sx={{ bgcolor: 'background.paper' }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
                    Prompt
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={section.prompt}
                    variant="outlined"
                    size="small"
                    sx={{ bgcolor: 'background.paper' }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleGenerateContent(section.id)}
                    sx={{ mt: 2 }}
                  >
                    Generate Content
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>

        {/* Section Options Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit Section
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete Section
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <HistoryIcon fontSize="small" sx={{ mr: 1 }} />
            View History
          </MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
};

export default DocumentEditor; 