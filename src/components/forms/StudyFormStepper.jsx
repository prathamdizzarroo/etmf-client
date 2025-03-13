import React, { useState, useEffect } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Paper,
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


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
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
    if (id) {
      fetchProtocol();
    }
  }, [id]);


 

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFormSubmit = async (stepData) => {
    try {
      setLoading(true);
      setError(null);

      // Merge new data with existing form data
      const updatedFormData = {
        ...formData,
        ...stepData
      };
      setFormData(updatedFormData);

      // If this is the last step, submit the entire form
      if (activeStep === steps.length - 1) {
        if (id) {
          // Update existing protocol
          await studyProtocolService.updateStudyProtocol(id, updatedFormData);
        } else {
          // Create new protocol
          await studyProtocolService.createStudyProtocol(updatedFormData);
        }
        setSuccess(true);
        setTimeout(() => {
          navigate('/studies'); // Navigate to studies list
        }, 2000);
      } else {
        handleNext();
      }
    } catch (err) {
      setError(err.message || 'Failed to save protocol');
    } finally {
      setLoading(false);
    }
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
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, my: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel onClick={() => setActiveStep(index)} sx={{ cursor: 'pointer' }}>
                {label}
              </StepLabel>
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