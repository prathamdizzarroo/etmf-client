import React from 'react';
import { Formik, Form } from 'formik';
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';

const OperationInputForm = ({ onSubmit, initialData }) => {
  const startingValues = {
    site_operations: {
      site_activation: {
        planned_sites_count: '',
        countries_involved: '',
        site_initiation_timeline: '',
        site_activation_strategy: '',
      },
      monitoring_plan: {
        monitoring_frequency: '',
        monitoring_type: '',
        risk_based_monitoring: false,
        central_monitoring: false,
      },
    },
    document_management: {
      filing_strategy: '',
      quality_control: {
        qc_level: '',
        qc_frequency: '',
        automated_checks: false,
      },
      retention_period: '',
      archival_strategy: '',
    },
    regulatory_compliance: {
      submission_timeline: '',
      regulatory_authorities: '',
      ethics_committee_strategy: '',
      safety_reporting: {
        reporting_timeline: '',
        safety_monitoring: '',
      },
    },
    vendor_management: {
      cro_details: {
        name: '',
        scope_of_work: '',
        oversight_plan: '',
      },
      central_lab: {
        name: '',
        services: '',
      },
      other_vendors: '',
    },
    ...initialData
  };

  return (
    <Formik
      initialValues={startingValues}
      onSubmit={onSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ values, handleChange, handleBlur }) => (
        <Form>
          {/* Site Operations Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Site Operations
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="site_operations.site_activation.planned_sites_count"
                  label="Planned Number of Sites"
                  type="number"
                  value={values.site_operations.site_activation.planned_sites_count}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="site_operations.site_activation.countries_involved"
                  label="Countries Involved"
                  value={values.site_operations.site_activation.countries_involved}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="site_operations.monitoring_plan.monitoring_type"
                  label="Monitoring Type"
                  value={values.site_operations.monitoring_plan.monitoring_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="on-site">On-site</MenuItem>
                  <MenuItem value="remote">Remote</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="site_operations.monitoring_plan.risk_based_monitoring"
                      checked={values.site_operations.monitoring_plan.risk_based_monitoring}
                      onChange={handleChange}
                    />
                  }
                  label="Risk-based Monitoring"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Document Management Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Document Management
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="document_management.filing_strategy"
                  label="Filing Strategy"
                  value={values.document_management.filing_strategy}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="concurrent">Concurrent Filing</MenuItem>
                  <MenuItem value="batch">Batch Filing</MenuItem>
                  <MenuItem value="hybrid">Hybrid Approach</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="document_management.quality_control.qc_level"
                  label="QC Level"
                  value={values.document_management.quality_control.qc_level}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="100">100% QC</MenuItem>
                  <MenuItem value="risk-based">Risk-based QC</MenuItem>
                  <MenuItem value="sampling">Sampling-based QC</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="document_management.quality_control.automated_checks"
                      checked={values.document_management.quality_control.automated_checks}
                      onChange={handleChange}
                    />
                  }
                  label="Automated QC Checks"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Regulatory Compliance Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Regulatory Compliance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="regulatory_compliance.regulatory_authorities"
                  label="Regulatory Authorities"
                  multiline
                  rows={2}
                  value={values.regulatory_compliance.regulatory_authorities}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="regulatory_compliance.safety_reporting.reporting_timeline"
                  label="Safety Reporting Timeline"
                  value={values.regulatory_compliance.safety_reporting.reporting_timeline}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Vendor Management Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Vendor Management
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="vendor_management.cro_details.name"
                  label="CRO Name"
                  value={values.vendor_management.cro_details.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="vendor_management.cro_details.scope_of_work"
                  label="CRO Scope of Work"
                  value={values.vendor_management.cro_details.scope_of_work}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="vendor_management.central_lab.name"
                  label="Central Lab Name"
                  value={values.vendor_management.central_lab.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="vendor_management.central_lab.services"
                  label="Central Lab Services"
                  value={values.vendor_management.central_lab.services}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default OperationInputForm; 