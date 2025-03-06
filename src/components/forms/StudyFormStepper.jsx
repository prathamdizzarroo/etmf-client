import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Paper,
  Typography,
  Container
} from '@mui/material';
import ClinicalIntakeForm from './ClinicalIntakeForm';
import OperationInputForm from './OperationInputForm';
import DocumentEditor from './DocumentEditor';
import DocumentMap from './DocumentMap';

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

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSave = (values) => {
    console.log('Saving form data:', values); // Debug log
    setFormData((prevData) => ({
      ...prevData,
      ...values
    }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <ClinicalIntakeForm 
              onSubmit={handleSave} 
              initialData={formData}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ ml: 1 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box>
            <OperationInputForm 
              onSubmit={handleSave}
              initialData={formData}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ ml: 1 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box>
            <DocumentEditor 
              onSubmit={handleSave}
              initialData={formData}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ ml: 1 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box>
            <DocumentMap />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ ml: 1 }}
              >
                Finish
              </Button>
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  const handleFinish = () => {
    // Handle form completion
    console.log('Final form data:', formData);
    // You can add API call here to save all the data
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Box sx={{ width: '100%', mt: 3 }}>
        <Stepper 
          activeStep={activeStep}
          sx={{ 
            mb: 4,
            '& .MuiStepLabel-root .Mui-completed': {
              color: 'success.main', // custom color for completed steps
            },
            '& .MuiStepLabel-root .Mui-active': {
              color: 'primary.main', // custom color for active step
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Paper 
          sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderRadius: 2,
          }}
        >
          {activeStep === steps.length ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                All steps completed
              </Typography>
              <Typography color="textSecondary" paragraph>
                Your clinical trial protocol has been successfully created and documented.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  onClick={() => setActiveStep(0)}
                  sx={{ mr: 1 }}
                >
                  Create New
                </Button>
                <Button 
                  variant="contained"
                  onClick={handleFinish}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          ) : (
            <>{getStepContent(activeStep)}</>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default StudyFormStepper; 