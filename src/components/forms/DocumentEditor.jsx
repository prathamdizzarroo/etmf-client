import React, { useState, useEffect } from 'react';
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
import { getPredefinedSections } from '../../constants/sectionData'; 
import { generateContent } from '../../services/AIService';;

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
  const storedData = localStorage.getItem('clinicalProtocolSections');
  return storedData ? JSON.parse(storedData) : getPredefinedSections();
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
  const [sections, setSections] = useState(getStoredSections());
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    localStorage.setItem('clinicalProtocolSections', JSON.stringify(sections));
  }, [sections]);

  const handleInputChange = (id, field, value) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const handleExport = () => exportToWord(sections);


  const handleGenerateContent = async (id) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
  
    try {
      const generatedContent = await generateContent(section.prompt, section.context, section.output);
  
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
  

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: '100%', bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" color="default" elevation={2}>
          <Toolbar sx={{ minHeight: 64 }}>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 500 }}>
              Clinical Trial Protocol Editor
            </Typography>
            <Tooltip title="Reset to Template">
              <Button startIcon={<ResetIcon />} onClick={() => setSections(getPredefinedSections())}>
                Reset
              </Button>
            </Tooltip>
            <Tooltip title="Save Changes">
              <Button startIcon={<SaveIcon />}>Save</Button>
            </Tooltip>
            <Tooltip title="Add New Section">
              <Button startIcon={<AddIcon />} sx={{ mx: 1 }}>Add Section</Button>
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

        <Box sx={{ p: 3 }}>
          {sections.map((section) => (
            <Paper key={section.id} sx={{ mb: 3, p: 3, borderRadius: 2, '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' } }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, color: 'primary.main' }}>
                  Section: {section.title}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Tooltip title="Copy Section">
                  <IconButton size="small"><CopyIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Version History">
                  <IconButton size="small"><HistoryIcon /></IconButton>
                </Tooltip>
                <Tooltip title="More Options">
                  <IconButton size="small" onClick={handleMenuOpen}><MoreIcon /></IconButton>
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
                  <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => handleGenerateContent(section.id)}>
                    Generate Content
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}><EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Section</MenuItem>
          <MenuItem onClick={handleMenuClose}><DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Section</MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}><HistoryIcon fontSize="small" sx={{ mr: 1 }} /> View History</MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
};

export default DocumentEditor;
