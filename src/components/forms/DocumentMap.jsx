import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  Button,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from '@mui/material';
import { TreeItem } from '@mui/x-tree-view';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Folder as FolderIcon,
  Description as DocumentIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
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

// Navigation items for the right sidebar
const navigationItems = [
  { id: 'subject-asset', name: 'Subject Asset Form', icon: <AssignmentIcon /> },
  { id: 'data-management', name: 'Data Management Plan', icon: <AssignmentIcon /> },
  { id: 'ib', name: 'IB', icon: <AssignmentIcon /> },
  { id: 'committees', name: 'Committees: DSMB, IDMC, ILDAC, Endpoint Adjudication, BICR, Steering Committee', icon: <PeopleIcon /> },
  { id: 'ae-sae', name: 'AE/SAE Reporting Plan', icon: <AssignmentIcon /> },
  { id: 'impd', name: 'IMPD', icon: <AssignmentIcon /> },
  { id: 'subject-reimbursement', name: 'Subject Reimbursement Policy', icon: <AssignmentIcon /> },
  { id: 'randomization', name: 'Randomization and Data blinding Plan', icon: <AssignmentIcon /> },
  { id: 'sap', name: 'SAP', icon: <AssignmentIcon /> },
  { id: 'country-feasibility', name: 'Study Country Level feasibility', icon: <AssignmentIcon /> },
  { id: 'safety-management', name: 'Safety Management Plan', icon: <AssignmentIcon /> },
  { id: 'patient-diary', name: 'Patient Diary and Log', icon: <AssignmentIcon /> },
  { id: 'data-transfer', name: 'Data Transfer Agreements', icon: <AssignmentIcon /> },
  { id: 'site-contract', name: 'Site Contract', icon: <AssignmentIcon /> },
  { id: 'site-feasibility', name: 'Study Site Level feasibility', icon: <AssignmentIcon /> },
  { id: 'protocol-deviation', name: 'Protocol Deviation monitoring Plan', icon: <AssignmentIcon /> },
  { id: 'sdv-plan', name: 'SDV Plan', icon: <AssignmentIcon /> },
  { id: 'ip-management', name: 'IP Management', icon: <AssignmentIcon /> },
  { id: 'site-training', name: 'Site Training Material', icon: <AssignmentIcon /> },
  { id: 'operational-feasibility', name: 'Study site Level operational feasibility', icon: <AssignmentIcon /> },
  { id: 'site-monitoring', name: 'Site Monitoring Plan', icon: <AssignmentIcon /> },
  { id: 'site-audit', name: 'Site Audit Plan', icon: <AssignmentIcon /> },
  { id: 'data-management-plan', name: 'Data Management Plan', icon: <AssignmentIcon /> },
  { id: 'recruitment', name: 'Recruitment Strategy', icon: <AssignmentIcon /> },
  { id: 'retention-compliance', name: 'Retention and Compliance Plan', icon: <AssignmentIcon /> },
  { id: 'data-management-plan2', name: 'Data management Plan', icon: <AssignmentIcon /> },
  { id: 'central-lab', name: 'Central Laboratory Manual', icon: <AssignmentIcon /> },
  { id: 'cultural-linguistic', name: 'Cultural and Linguistic adaption guidelines', icon: <AssignmentIcon /> },
  { id: 'trial-monitoring', name: 'Trial Monitoring Plan including RBM', icon: <AssignmentIcon /> },
  { id: 'translational-analysis', name: 'Translational Analysis Plan', icon: <AssignmentIcon /> },
  { id: 'imaging-charter', name: 'Imaging Charter', icon: <AssignmentIcon /> },
  { id: 'bioanalytical', name: 'Bioanalytical Sample collection and Processing manual', icon: <AssignmentIcon /> },
  { id: 'pk-pd', name: 'PK/PD Analysis Plan', icon: <AssignmentIcon /> },
  { id: 'lnr-management', name: 'LNR Management Plan', icon: <AssignmentIcon /> }
];

const FlowChartCanvas = ({ width = 800, height = 500 }) => {
  const canvasRef = useRef(null);

  const drawBox = (ctx, x, y, width, height, text, style = 'default') => {
    ctx.save();
    
    // Box fill color based on style
    ctx.fillStyle = style === 'highlighted' ? '#fff3e0' : 
                   style === 'special' ? '#e3f2fd' : '#ffffff';
    
    // Draw rounded rectangle with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Path for rounded rectangle
    ctx.beginPath();
    const radius = 8;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    
    // Fill and stroke
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = style === 'highlighted' ? '#ffb74d' : 
                     style === 'special' ? '#64b5f6' : '#90a4ae';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Text
    ctx.fillStyle = '#37474f';
    ctx.font = '13px Roboto, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Handle text wrapping
    const words = text.split(' ');
    let line = '';
    let lines = [];
    const maxWidth = width - 16;
    
    for (let word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        lines.push(line);
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    
    // Draw wrapped text
    const lineHeight = 16;
    const startY = y + (height/2) - ((lines.length - 1) * lineHeight/2);
    lines.forEach((line, i) => {
      ctx.fillText(line.trim(), x + width/2, startY + (i * lineHeight));
    });
    
    ctx.restore();
  };

  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    ctx.save();
    
    // Draw path with gradient
    const gradient = ctx.createLinearGradient(fromX, fromY, toX, toY);
    gradient.addColorStop(0, '#90a4ae');
    gradient.addColorStop(1, '#607d8b');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    
    // Draw curved path
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    
    // If it's a vertical line
    if (Math.abs(fromX - toX) < 10) {
      ctx.lineTo(toX, toY);
    } else {
      // Create a curved path
      const controlPointY = (fromY + toY) / 2;
      ctx.bezierCurveTo(
        fromX, controlPointY,
        toX, controlPointY,
        toX, toY
      );
    }
    ctx.stroke();
    
    // Draw arrowhead
    const headlen = 10;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headlen * Math.cos(angle - Math.PI / 6),
      toY - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headlen * Math.cos(angle + Math.PI / 6),
      toY - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
    
    ctx.restore();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    // Enable antialiasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Box dimensions
    const boxWidth = 140;
    const boxHeight = 40;
    const gap = 30;
    const centerX = width/2;

    // Core modules
    drawBox(ctx, centerX - boxWidth - gap*2, 20, boxWidth, boxHeight, 'Core Clinical module', 'highlighted');
    drawBox(ctx, centerX + gap*2, 20, boxWidth, boxHeight, 'Core Operations Module', 'highlighted');

    // Protocol Synopsis
    const synopsisY = 100;
    drawBox(ctx, centerX - boxWidth/2, synopsisY, boxWidth, boxHeight, 'Protocol Synopsis');
    drawArrow(ctx, centerX - boxWidth/2 + boxWidth/2, 60, centerX, synopsisY);

    // Protocol
    const protocolY = synopsisY + boxHeight + 40;
    drawBox(ctx, centerX - boxWidth/2, protocolY, boxWidth, boxHeight, 'Protocol');
    drawArrow(ctx, centerX, synopsisY + boxHeight, centerX, protocolY);

    // Master ICF and CRF Design
    const branchY = protocolY + boxHeight + 50;
    const leftX = centerX - boxWidth*1.5 - gap;
    const rightX = centerX + boxWidth/2 + gap;

    drawBox(ctx, leftX, branchY, boxWidth, boxHeight, 'Master ICF');
    drawBox(ctx, rightX, branchY, boxWidth, boxHeight, 'CRF Design');

    // Draw connectors from Protocol
    drawArrow(ctx, centerX - boxWidth/4, protocolY + boxHeight, leftX + boxWidth/2, branchY);
    drawArrow(ctx, centerX + boxWidth/4, protocolY + boxHeight, rightX + boxWidth/2, branchY);

    // CRF Completion Guideline
    const guidelineY = branchY + boxHeight + 50;
    drawBox(ctx, centerX - boxWidth/2, guidelineY, boxWidth, boxHeight, 'CRF Completion Guideline');
    drawArrow(ctx, rightX + boxWidth/2, branchY + boxHeight, centerX, guidelineY);

    // TMF
    const tmfY = guidelineY + boxHeight + 60;
    drawBox(ctx, centerX - boxWidth/2, tmfY, boxWidth, boxHeight, 'TMF', 'special');

    // Connect all paths to TMF
    drawArrow(ctx, leftX + boxWidth/2, branchY + boxHeight, centerX - boxWidth/4, tmfY);
    drawArrow(ctx, centerX, guidelineY + boxHeight, centerX, tmfY);
    drawArrow(ctx, rightX + boxWidth/2, branchY + boxHeight + 25, centerX + boxWidth/4, tmfY);

    // Side documents
    const sideX = centerX + boxWidth*1.5 + gap;
    drawBox(ctx, sideX, tmfY - boxHeight - gap, boxWidth, boxHeight, 'Documents from Sites', 'highlighted');
    drawBox(ctx, sideX, tmfY + gap, boxWidth, boxHeight, 'Documents from Company', 'highlighted');

    // Connect side documents
    drawArrow(ctx, centerX + boxWidth/2, tmfY, sideX, tmfY - boxHeight/2 - gap);
    drawArrow(ctx, centerX + boxWidth/2, tmfY + boxHeight/2, sideX, tmfY + gap + boxHeight/2);

    // Submission packages
    const submissionY = tmfY + boxHeight + 60;
    const sp1X = centerX - boxWidth*1.5 - gap;
    const sp3X = centerX + boxWidth/2 + gap;

    drawBox(ctx, sp1X, submissionY, boxWidth, boxHeight, 'Submission Package 1');
    drawBox(ctx, centerX - boxWidth/2, submissionY, boxWidth, boxHeight, 'Submission Package 2');
    drawBox(ctx, sp3X, submissionY, boxWidth, boxHeight, 'Submission Package 3');

    // Connect TMF to submission packages
    drawArrow(ctx, centerX, tmfY + boxHeight, sp1X + boxWidth/2, submissionY);
    drawArrow(ctx, centerX, tmfY + boxHeight, centerX, submissionY);
    drawArrow(ctx, centerX, tmfY + boxHeight, sp3X + boxWidth/2, submissionY);
  };
  // eslint-disable-next-line
  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
        margin: '0 auto',
      }}
    />
  );
};

const DocumentMap = ({ onSubmit, initialData, loading }) => {
  // const [viewMode, setViewMode] = useState('tree');
  const [searchTerm, setSearchTerm] = useState('');
  // const [expanded, setExpanded] = useState(['root']);
  const [selectedItem, setSelectedItem] = useState('overview');

  // Handle Next button click
  const handleNextClick = () => {
    if (onSubmit) {
      // Pass the document map data to the parent component
      onSubmit({ document_map: documentHierarchy });
    }
  };

  // const handleToggle = (event, nodeIds) => {
  //   setExpanded(nodeIds);
  // };

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
  // eslint-disable-next-line
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

  const renderComponent = (selectedItem) => {
    const selectedNav = navigationItems.find(item => item.id === selectedItem);
    
    if (!selectedNav) {
      return (
        <Box sx={{ p: 3, height: 'calc(100vh - 128px)' }}>
          <Typography variant="h5">Select an item from the sidebar</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 3, height: 'calc(100vh - 128px)', overflow: 'auto' }}>
        <Typography variant="h5" gutterBottom>{selectedNav.name}</Typography>
        <Paper sx={{ p: 3, position: 'relative', minHeight: 'calc(100% - 48px)' }}>
          {/* Flow Chart */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <FlowChartCanvas width={700} height={600} />
          </Box>

          {/* Document Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Documents</Typography>
            <Typography variant="body1" paragraph>
              This section contains information and documents related to {selectedNav.name.toLowerCase()}.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="primary"
            >
              Add Document
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderReportsAndAnalytics = () => (
    <Box sx={{ p: 3, height: 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Typography variant="h5" gutterBottom>Reports & Analytics</Typography>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Total Documents</Typography>
            <Typography variant="h3" color="primary">156</Typography>
            <Typography variant="body2" color="text.secondary">Last updated: Today</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Active Studies</Typography>
            <Typography variant="h3" color="secondary">12</Typography>
            <Typography variant="body2" color="text.secondary">Across 5 projects</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Pending Reviews</Typography>
            <Typography variant="h3" sx={{ color: 'warning.main' }}>8</Typography>
            <Typography variant="body2" color="text.secondary">Requires attention</Typography>
          </Paper>
        </Grid>

        {/* Charts Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Document Status Distribution</Typography>
            <Box sx={{ 
              height: '300px', 
              display: 'flex', 
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              pt: 4 
            }}>
              {/* Dummy Bar Chart */}
              <Box sx={{ width: '60px', height: '80%', bgcolor: 'success.light', borderRadius: 1 }} />
              <Box sx={{ width: '60px', height: '60%', bgcolor: 'warning.light', borderRadius: 1 }} />
              <Box sx={{ width: '60px', height: '40%', bgcolor: 'error.light', borderRadius: 1 }} />
              <Box sx={{ width: '60px', height: '70%', bgcolor: 'info.light', borderRadius: 1 }} />
              <Box sx={{ width: '60px', height: '50%', bgcolor: 'secondary.light', borderRadius: 1 }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
              <Typography variant="caption">Complete</Typography>
              <Typography variant="caption">In Progress</Typography>
              <Typography variant="caption">Pending</Typography>
              <Typography variant="caption">Review</Typography>
              <Typography variant="caption">Draft</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            <List>
              {[
                { text: 'Protocol v2.0 updated', time: '2 hours ago' },
                { text: 'New ICF Template added', time: '4 hours ago' },
                { text: 'Site Documentation reviewed', time: '1 day ago' },
                { text: 'CRF Design approved', time: '2 days ago' },
                { text: 'TMF audit completed', time: '3 days ago' },
              ].map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText 
                    primary={item.text}
                    secondary={item.time}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderSettings = () => (
    <Box sx={{ p: 3, height: 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Typography variant="h5" gutterBottom>Settings</Typography>
      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>General Settings</Typography>
            <List>
              <ListItem>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText 
                  primary="Default View Mode"
                  secondary="Choose between grid or list view"
                />
                <Button variant="outlined" size="small">Change</Button>
              </ListItem>
              <ListItem>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText 
                  primary="Notifications"
                  secondary="Manage email and system notifications"
                />
                <Button variant="outlined" size="small">Configure</Button>
              </ListItem>
              <ListItem>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText 
                  primary="Language"
                  secondary="Set your preferred language"
                />
                <Button variant="outlined" size="small">Select</Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* User Preferences */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>User Preferences</Typography>
            <List>
              <ListItem>
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText 
                  primary="Profile Settings"
                  secondary="Update your personal information"
                />
                <Button variant="outlined" size="small">Edit</Button>
              </ListItem>
              <ListItem>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText 
                  primary="Theme"
                  secondary="Choose between light and dark mode"
                />
                <Button variant="outlined" size="small">Change</Button>
              </ListItem>
              <ListItem>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                <ListItemText 
                  primary="Accessibility"
                  secondary="Configure accessibility options"
                />
                <Button variant="outlined" size="small">Configure</Button>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* System Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>System Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2">Version</Typography>
                <Typography variant="body1">v1.2.0</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2">Last Updated</Typography>
                <Typography variant="body1">March 13, 2024</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2">Storage Used</Typography>
                <Typography variant="body1">1.2 GB of 5 GB</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  const renderMainContent = () => {
    switch(selectedItem) {
      case 'reports':
        return renderReportsAndAnalytics();
      case 'settings':
        return renderSettings();
      default:
        return renderComponent(selectedItem);
    }
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ 
      height: '100%', 
      bgcolor: 'background.default', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
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
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            sx={{ ml: 2 }}
          >
            Add Document
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Main content area */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'hidden', 
          p: 0,
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {renderMainContent()}
        </Box>

        {/* Right sidebar navigation */}
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              position: 'relative',
              border: 'none',
              borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
              height: 'calc(100vh - 64px)',
            },
          }}
        >
          <Box sx={{ 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Typography variant="h6">Documents</Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="Search documents..."
                sx={{ mt: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <List
              sx={{
                overflow: 'auto',
                flexGrow: 1,
                '& .MuiListItem-root': {
                  py: 1,
                  px: 2,
                },
                '& .MuiListItemText-root': {
                  '& .MuiTypography-root': {
                    fontSize: '0.875rem',
                    lineHeight: 1.3,
                  },
                },
              }}
            >
              {navigationItems.map((item) => (
                <ListItem 
                  button 
                  key={item.id}
                  selected={selectedItem === item.id}
                  onClick={() => setSelectedItem(item.id)}
                  sx={{
                    borderLeft: selectedItem === item.id ? 3 : 0,
                    borderColor: 'primary.main',
                    '&.Mui-selected': {
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.name}
                    primaryTypographyProps={{
                      style: {
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>

      {/* Next Button for StudyFormStepper */}
      {onSubmit && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleNextClick}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Finish'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DocumentMap; 