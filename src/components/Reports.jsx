import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Description as DocumentIcon,
  Science as ScienceIcon,
  Assignment as AssignmentIcon,
  Update as UpdateIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
} from '@mui/icons-material';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const MetricCard = ({ title, value, trend, trendValue, color }) => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
        <Typography variant="h4" component="span" sx={{ mr: 1 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: trend === 'up' ? 'success.main' : 'error.main' }}>
          {trend === 'up' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            {trendValue}
          </Typography>
        </Box>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={typeof value === 'string' ? parseInt(value) : value} 
        sx={{ 
          height: 6, 
          borderRadius: 3,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            bgcolor: color
          }
        }} 
      />
    </Paper>
  );

  const DocumentAnalyticsContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document Type</TableCell>
                <TableCell align="right">Total Count</TableCell>
                <TableCell align="right">Completed</TableCell>
                <TableCell align="right">In Progress</TableCell>
                <TableCell align="right">Pending Review</TableCell>
                <TableCell align="right">Completion Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[
                { type: 'Protocol', total: 15, completed: 12, inProgress: 2, pending: 1, rate: 80 },
                { type: 'ICF', total: 25, completed: 20, inProgress: 3, pending: 2, rate: 85 },
                { type: 'CRF', total: 30, completed: 25, inProgress: 4, pending: 1, rate: 83 },
                { type: 'Safety Reports', total: 40, completed: 35, inProgress: 3, pending: 2, rate: 88 },
                { type: 'Site Documents', total: 50, completed: 45, inProgress: 3, pending: 2, rate: 90 },
              ].map((row) => (
                <TableRow key={row.type}>
                  <TableCell component="th" scope="row">{row.type}</TableCell>
                  <TableCell align="right">{row.total}</TableCell>
                  <TableCell align="right">{row.completed}</TableCell>
                  <TableCell align="right">{row.inProgress}</TableCell>
                  <TableCell align="right">{row.pending}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <LinearProgress
                        variant="determinate"
                        value={row.rate}
                        sx={{ width: 100, mr: 1 }}
                      />
                      {row.rate}%
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );

  const StudyMetricsContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Study Progress Overview</Typography>
          <List>
            {[
              { name: 'Study ABC-123', progress: 85, status: 'Active' },
              { name: 'Study XYZ-456', progress: 60, status: 'Active' },
              { name: 'Study DEF-789', progress: 95, status: 'Closing' },
              { name: 'Study GHI-012', progress: 75, status: 'Active' },
            ].map((study, index) => (
              <React.Fragment key={study.name}>
                <ListItem>
                  <ListItemText
                    primary={study.name}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {study.status}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={study.progress}
                          sx={{ mt: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {study.progress}% Complete
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < 3 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Study Metrics</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle2">Average Document Processing Time</Typography>
                <Typography variant="h4">3.5 days</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle2">Document Review Efficiency</Typography>
                <Typography variant="h4">92%</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );

  const ComplianceContent = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Regulatory Compliance Status</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Requirement</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Actions Required</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  {
                    requirement: 'ICF Documentation',
                    status: 'Compliant',
                    updated: '2024-03-12',
                    risk: 'Low',
                    actions: 'None',
                  },
                  {
                    requirement: 'Protocol Adherence',
                    status: 'Partial',
                    updated: '2024-03-10',
                    risk: 'Medium',
                    actions: 'Review needed',
                  },
                  {
                    requirement: 'Safety Reporting',
                    status: 'Compliant',
                    updated: '2024-03-13',
                    risk: 'Low',
                    actions: 'None',
                  },
                ].map((row) => (
                  <TableRow key={row.requirement}>
                    <TableCell>{row.requirement}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {row.status === 'Compliant' ? (
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        ) : (
                          <WarningIcon color="warning" sx={{ mr: 1 }} />
                        )}
                        {row.status}
                      </Box>
                    </TableCell>
                    <TableCell>{row.updated}</TableCell>
                    <TableCell>{row.risk}</TableCell>
                    <TableCell>{row.actions}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Reports & Analytics</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Download Report">
            <IconButton>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <FormControl size="small" sx={{ width: 150, ml: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs 
        value={currentTab} 
        onChange={handleTabChange}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="Document Analytics" />
        <Tab label="Study Metrics" />
        <Tab label="Compliance" />
      </Tabs>

      {/* Overview Tab */}
      {currentTab === 0 && (
        <Grid container spacing={3}>
          {/* Key Metrics */}
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Document Completion Rate"
              value="85%"
              trend="up"
              trendValue="+5%"
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Active Studies"
              value="12"
              trend="up"
              trendValue="+2"
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Pending Reviews"
              value="24"
              trend="down"
              trendValue="-8"
              color="warning.main"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              title="Compliance Score"
              value="92%"
              trend="up"
              trendValue="+3%"
              color="success.main"
            />
          </Grid>

          {/* Document Status Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Document Status Distribution</Typography>
                <Tooltip title="View Details">
                  <IconButton size="small">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ 
                height: '300px', 
                display: 'flex', 
                alignItems: 'flex-end',
                justifyContent: 'space-around',
                pt: 4 
              }}>
                {/* Placeholder for actual chart */}
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

          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              <List>
                {[
                  { text: 'Protocol v2.0 updated', time: '2 hours ago', type: 'update', icon: <UpdateIcon color="primary" /> },
                  { text: 'New ICF Template added', time: '4 hours ago', type: 'add', icon: <DocumentIcon color="success" /> },
                  { text: 'Study ABC-123 completed', time: '1 day ago', type: 'complete', icon: <CheckCircleIcon color="success" /> },
                  { text: 'Review required: Safety Report', time: '1 day ago', type: 'warning', icon: <WarningIcon color="warning" /> },
                  { text: 'Missing document: Site Logs', time: '2 days ago', type: 'error', icon: <ErrorIcon color="error" /> },
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        secondary={item.time}
                      />
                    </ListItem>
                    {index < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Compliance Overview */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Compliance Overview</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle1">Document Completeness</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={85} 
                      sx={{ my: 2, height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="body2">85% of required documents are complete</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle1">Quality Metrics</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={92} 
                      sx={{ my: 2, height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="body2">92% documents meet quality standards</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Typography variant="subtitle1">Audit Readiness</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={78} 
                      sx={{ my: 2, height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="body2">78% ready for regulatory inspection</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Document Analytics Tab */}
      {currentTab === 1 && <DocumentAnalyticsContent />}

      {/* Study Metrics Tab */}
      {currentTab === 2 && <StudyMetricsContent />}

      {/* Compliance Tab */}
      {currentTab === 3 && <ComplianceContent />}
    </Box>
  );
};

export default Reports; 