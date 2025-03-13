import React, { useState, useEffect } from 'react';
import { useFormState } from 'react-hook-form';
import { Formik, Form } from 'formik';
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import studyProtocolService from '../../services/studyProtocol.service';

const initialValues = {
  site_operations: {
    site_activation: {
      planned_sites_count: '',
      countries_involved: '',
      site_initiation_timeline: '',
      site_activation_strategy: ''
    },
    monitoring_plan: {
      monitoring_frequency: '',
      monitoring_type: '',
      risk_based_monitoring: false,
      central_monitoring: false
    }
  },
  document_management: {
    filing_strategy: '',
    quality_control: {
      qc_level: '',
      qc_frequency: '',
      automated_checks: false
    },
    retention_period: '',
    archival_strategy: ''
  },
  regulatory_compliance: {
    submission_timeline: '',
    regulatory_authorities: '',
    ethics_committee_strategy: '',
    safety_reporting: {
      reporting_timeline: '',
      safety_monitoring: ''
    }
  },
  vendor_management: {
    cro_details: {
      name: '',
      scope_of_work: '',
      oversight_plan: ''
    },
    central_lab: {
      name: '',
      services: ''
    },
    other_vendors: ''
  }
};

const OperationInputForm = ({ onSubmit, initialData = {}, loading = false }) => {
  // const [submitError, setSubmitError] = useState(null);
  // const [submitSuccess, setSubmitSuccess] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const { setSubmitError, setSubmitSuccess, setIsSubmitting } = useFormState();

  const [existingProtocol, setExistingProtocol] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch existing protocol data if we have an ID
  useEffect(() => {
    const fetchProtocol = async () => {
      if (id) {
        try {
          const protocol = await studyProtocolService.getStudyProtocolById(id);
          setExistingProtocol(protocol);
        } catch (error) {
          console.error('Error fetching protocol:', error);
          // setSubmitError('Error loading existing protocol data');
        }
      }
    };

    fetchProtocol();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      let response;
      
      // Prepare the complete protocol data
      const protocolData = {
        // If we have existing protocol data, spread it first
        ...(existingProtocol || {}),
        // Required Study Identification fields
        study_identification: {
          study_title: "Test Study",
          protocol_number: "TEST-001",
          version_number_date: new Date().toISOString().split('T')[0],
          sponsor_name: "Test Sponsor",
          ...values.study_identification
        },
        // Required Study Overview fields
        study_overview: {
          therapeutic_area: "Oncology",
          disease_indication: "Cancer",
          study_phase: "Phase I",
          study_type: "Interventional",
          randomization: false,
          blinding: "Open-Label",
          primary_objective: "Test objective",
          ...values.study_overview
        },
        // Required Target Population fields
        target_population: {
          patient_population_description: "Test population",
          key_inclusion_criteria: [],
          key_exclusion_criteria: [],
          ...values.target_population
        },
        // Required Study Treatments fields
        study_treatments: {
          investigational_product: {
            name: "Test Drug",
            dose_schedule: "Once daily",
            route_of_administration: "Oral",
            ...values.study_treatments?.investigational_product
          },
          ...values.study_treatments
        },
        // Required Study Design Details
        study_design_details: {
          number_of_arms: 2,
          sample_size_total: 100,
          number_of_sites: 10,
          ...values.study_design_details
        },
        // Required Regulatory and Ethical Requirements
        regulatory_ethical_requirements: {
          planned_start_date: new Date().toISOString().split('T')[0],
          irb_approvals_required: true,
          informed_consent_required: true,
          ...values.regulatory_ethical_requirements
        },
        // Required Study Monitoring Logistics - Using exact enum values from the model
        study_monitoring_logistics: {
          data_collection_method: "Electronic Data Capture (EDC)", // Exact enum value from model
          on_site_or_remote: "On-Site", // Exact enum value from model
          key_contacts: {
            sponsor_contact: "Test Contact",
            ...values.study_monitoring_logistics?.key_contacts
          },
          ...values.study_monitoring_logistics
        },
        // Operational data with correct enum values
        site_operations: {
          ...values.site_operations,
          monitoring_plan: {
            ...values.site_operations?.monitoring_plan,
            monitoring_type: values.site_operations?.monitoring_plan?.monitoring_type || "on-site" // Ensure correct enum value
          }
        },
        document_management: {
          ...values.document_management,
          filing_strategy: values.document_management?.filing_strategy || "concurrent", // Ensure correct enum value
          quality_control: {
            ...values.document_management?.quality_control,
            qc_level: values.document_management?.quality_control?.qc_level || "100" // Ensure correct enum value
          }
        },
        regulatory_compliance: values.regulatory_compliance,
        vendor_management: values.vendor_management,
        // Add status and timestamps
        status: existingProtocol?.status || 'draft',
        updatedAt: new Date().toISOString(),
        // If it's a new protocol, add createdAt
        ...((!id) && { createdAt: new Date().toISOString() })
      };

      // Convert any string numbers to actual numbers
      if (typeof protocolData.study_design_details.number_of_arms === 'string') {
        protocolData.study_design_details.number_of_arms = parseInt(protocolData.study_design_details.number_of_arms, 10);
      }
      if (typeof protocolData.study_design_details.sample_size_total === 'string') {
        protocolData.study_design_details.sample_size_total = parseInt(protocolData.study_design_details.sample_size_total, 10);
      }
      if (typeof protocolData.study_design_details.number_of_sites === 'string') {
        protocolData.study_design_details.number_of_sites = parseInt(protocolData.study_design_details.number_of_sites, 10);
      }

      // If we're in the stepper, just pass the data to the parent component
      if (onSubmit) {
        console.log('Submitting to parent component');
        onSubmit(protocolData);
        setSubmitSuccess(true);
        setIsSubmitting(false);
        setSubmitting(false);
        response = await studyProtocolService.createStudyProtocol(protocolData);

        return; // Exit early, let the parent handle the rest
      }

      // Otherwise, handle the API call ourselves
      if (id) {
        // Update existing protocol
        response = await studyProtocolService.updateStudyProtocol(id, protocolData);
      } else {
        // Create new protocol
        response = await studyProtocolService.createStudyProtocol(protocolData);
      }

      setSubmitSuccess(true);
      console.log('Protocol saved successfully:', response);
      
      // Navigate to the next step or appropriate page
      setTimeout(() => {
        if (id) {
          navigate(`/study-protocols/${id}/document-editor`);
        } else if (response && response._id) {
          navigate(`/study-protocols/${response._id}/edit`);
        } else {
          navigate('/study-protocols');
        }
      }, 1000);

    } catch (error) {
      console.error('Error submitting protocol:', error);
      setSubmitError(error.message || 'An error occurred while saving the protocol');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ 
        ...initialValues, 
        ...(existingProtocol?.site_operations && { site_operations: existingProtocol.site_operations }),
        ...(existingProtocol?.document_management && { document_management: existingProtocol.document_management }),
        ...(existingProtocol?.regulatory_compliance && { regulatory_compliance: existingProtocol.regulatory_compliance }),
        ...(existingProtocol?.vendor_management && { vendor_management: existingProtocol.vendor_management }),
        ...initialData 
      }}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
      enableReinitialize={true}
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Next'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default OperationInputForm; 