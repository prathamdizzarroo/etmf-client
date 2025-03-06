import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import {
  ExpandMore,
  ChevronRight,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Folder as FolderIcon,
  Description as DocumentIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
} from '@mui/icons-material';

const documentHierarchy = {
  id: 'root',
  name: 'Trial Master File',
  children: [
    {
      id: '1',
      name: 'Trial Oversight',
      status: 'Complete',
      children: [
        {
          id: '1.1',
          name: 'Protocol and Amendments',
          status: 'In Progress',
          documents: [
            { id: 'd1', name: 'Protocol v1.0', date: '2024-01-15', status: 'Approved' },
            { id: 'd2', name: 'Protocol v2.0', date: '2024-02-20', status: 'Draft' },
          ]
        },
        {
          id: '1.2',
          name: 'Informed Consent Forms',
          status: 'Complete',
          documents: [
            { id: 'd3', name: 'ICF Template', date: '2024-01-10', status: 'Approved' },
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Regulatory Documentation',
      status: 'In Progress',
      children: [
        {
          id: '2.1',
          name: 'IRB/IEC Communications',
          status: 'Pending',
          documents: [
            { id: 'd4', name: 'IRB Approval', date: '2024-02-01', status: 'Pending' },
          ]
        },
        {
          id: '2.2',
          name: 'Regulatory Submissions',
          status: 'In Progress',
          documents: [
            { id: 'd5', name: 'FDA Form 1572', date: '2024-01-25', status: 'In Review' },
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Site Documentation',
      status: 'Not Started',
      children: [
        {
          id: '3.1',
          name: 'Site Selection',
          status: 'Not Started',
          documents: []
        },
        {
          id: '3.2',
          name: 'Site Monitoring',
          status: 'Not Started',
          documents: []
        }
      ]
    }
  ]
};

const DocumentMap = () => {
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'grid'
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(['root']);

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'complete':
        return 'success';
      case 'in progress':
        return 'warning';
      case 'pending':
        return 'info';
      case 'approved':
        return 'success';
      case 'draft':
        return 'default';
      case 'in review':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderTree = (nodes) => (
    <TreeItem 
      key={nodes.id}
      nodeId={nodes.id}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
          {nodes.documents ? <DocumentIcon color="action" sx={{ mr: 1 }} /> : <FolderIcon color="primary" sx={{ mr: 1 }} />}
          <Typography variant="body2" sx={{ mr: 2 }}>
            {nodes.name}
          </Typography>
          {nodes.status && (
            <Chip 
              label={nodes.status} 
              size="small" 
              color={getStatusColor(nodes.status)}
              sx={{ ml: 'auto' }}
            />
          )}
        </Box>
      }
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
      {nodes.documents?.map((doc) => (
        <TreeItem
          key={doc.id}
          nodeId={doc.id}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
              <DocumentIcon color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ mr: 2 }}>
                {doc.name}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mr: 2 }}>
                {doc.date}
              </Typography>
              <Chip 
                label={doc.status} 
                size="small" 
                color={getStatusColor(doc.status)}
                sx={{ ml: 'auto' }}
              />
            </Box>
          }
        />
      ))}
    </TreeItem>
  );

  const renderGridView = () => (
    <Grid container spacing={2}>
      {documentHierarchy.children.map((section) => (
        <Grid item xs={12} md={4} key={section.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {section.name}
              </Typography>
              <Chip 
                label={section.status} 
                color={getStatusColor(section.status)}
                size="small" 
                sx={{ mb: 2 }}
              />
              {section.children.map((subsection) => (
                <Box key={subsection.id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {subsection.name}
                  </Typography>
                  {subsection.documents?.map((doc) => (
                    <Box 
                      key={doc.id} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        mb: 1,
                        p: 1,
                        borderRadius: 1,
                        bgcolor: 'background.default'
                      }}
                    >
                      <DocumentIcon fontSize="small" sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="body2">{doc.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {doc.date}
                        </Typography>
                      </Box>
                      <Chip 
                        label={doc.status} 
                        size="small" 
                        color={getStatusColor(doc.status)}
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                  ))}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ height: '100%', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Document Map
          </Typography>
          <TextField
            size="small"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2, width: 250 }}
          />
          <Tooltip title="Filter">
            <IconButton>
              <FilterIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle View">
            <IconButton onClick={() => setViewMode(viewMode === 'tree' ? 'grid' : 'tree')}>
              {viewMode === 'tree' ? <GridViewIcon /> : <ViewListIcon />}
            </IconButton>
          </Tooltip>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            sx={{ ml: 2 }}
          >
            Add Document
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {viewMode === 'tree' ? (
          <Paper sx={{ p: 2 }}>
            <TreeView
              expanded={expanded}
              onNodeToggle={handleToggle}
              defaultCollapseIcon={<ExpandMore />}
              defaultExpandIcon={<ChevronRight />}
            >
              {renderTree(documentHierarchy)}
            </TreeView>
          </Paper>
        ) : (
          renderGridView()
        )}
      </Box>
    </Box>
  );
};

export default DocumentMap; 