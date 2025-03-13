import React, { useState, useEffect } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Paper,
  Typography,
  Container,
  Alert,
  Snackbar
} from '@mui/material';
import ClinicalIntakeForm from './ClinicalIntakeForm';
import OperationInputForm from './OperationInputForm';
import DocumentEditor from './DocumentEditor';
import DocumentMap from './DocumentMap';
import studyProtocolService from '../../services/studyProtocol.service';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const steps = [
  'Clinical Intake',
  'Operation Input',
  'Document Editor',
  'Document Map'
];

const initialFormData = {
  study_identification: {
    study_title: '',
    protocol_number: '',
    version_number_date: '',
    sponsor_name: '',
    cro: '',
  },
  study_overview: {
    therapeutic_area: '',
    disease_indication: '',
    study_phase: '',
    study_type: '',
    randomization: false,
    blinding: '',
    primary_objective: '',
    secondary_objectives: '',
  },
  target_population: {
    patient_population_description: '',
    key_inclusion_criteria: [''],
    key_exclusion_criteria: [''],
  },
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
};

const StudyFormStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing protocols

  useEffect(() => {
    // If we have an ID, fetch the existing protocol
    if (id) {
      fetchProtocol();
    }
  }, [id]);

  const fetchProtocol = async () => {
    try {
      setLoading(true);
      const data = await studyProtocolService.getStudyProtocolById(id);
      setFormData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch protocol');
      setLoading(false);
    }
  };

  const handleFormSubmit = (stepData) => {
    // Merge the new step data with existing form data
    setFormData((prevData) => ({
      ...prevData,
      ...stepData
    }));

    // If this is the last step, submit the entire form
    if (activeStep === steps.length - 1) {
      setLoading(true);
      
      const submitData = {
        ...formData,
        ...stepData
      };
      
      // Either update existing protocol or create new one
      const apiCall = id
        ? api.put(`/protocols/${id}`, submitData)
        : api.post('/protocols', submitData);
      
      apiCall
        .then(() => {
          setSuccess(true);
          setLoading(false);
          // Navigate to studies list after successful submission
          setTimeout(() => {
            navigate('/studies');
          }, 2000);
        })
        .catch((err) => {
          setError(err.response?.data?.message || 'An error occurred');
          setLoading(false);
        });
    } else {
      // If not the last step, proceed to next step
      handleNext();
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ClinicalIntakeForm
            onSubmit={handleFormSubmit}
            initialData={formData}
            loading={loading}
          />
        );
      case 1:
        return (
          <OperationInputForm
            onSubmit={handleFormSubmit}
            initialData={formData}
            loading={loading}
          />
        );
      case 2:
        return (
          <DocumentEditor
            onSubmit={handleFormSubmit}
            initialData={formData}
            loading={loading}
          />
        );
      case 3:
        return (
          <DocumentMap
            onSubmit={handleFormSubmit}
            initialData={formData}
            loading={loading}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          
          {/* Manual Next button for direct navigation */}
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
            >
              Skip to Next
            </Button>
          )}
        </Box>

        <Snackbar
          open={error !== null}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Protocol {id ? 'updated' : 'created'} successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default StudyFormStepper; 