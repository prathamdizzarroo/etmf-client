import React from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

// Validation Schema
const validationSchema = Yup.object({
  study_identification: Yup.object({
    study_title: Yup.string().required('Required'),
    protocol_number: Yup.string().required('Required'),
    version_number_date: Yup.string().required('Required'),
    sponsor_name: Yup.string().required('Required'),
    cro: Yup.string(),
  }),
  study_overview: Yup.object({
    therapeutic_area: Yup.string().required('Required'),
    disease_indication: Yup.string().required('Required'),
    study_phase: Yup.string().required('Required'),
    study_type: Yup.string().required('Required'),
    randomization: Yup.boolean().required('Required'),
    blinding: Yup.string().required('Required'),
    primary_objective: Yup.string().required('Required'),
    secondary_objectives: Yup.string(),
  }),
  target_population: Yup.object({
    patient_population_description: Yup.string().required('Required'),
    key_inclusion_criteria: Yup.array().of(Yup.string()),
    key_exclusion_criteria: Yup.array().of(Yup.string()),
  }),
  study_treatments: Yup.object({
    investigational_product: Yup.object({
      name: Yup.string().required('Required'),
      dose_schedule: Yup.string().required('Required'),
      route_of_administration: Yup.string().required('Required'),
    }),
    comparator: Yup.object({
      name: Yup.string(),
      dose_schedule: Yup.string(),
      route_of_administration: Yup.string(),
    }),
    concomitant_medications_allowed: Yup.string(),
  }),
  study_endpoints: Yup.object({
    primary_endpoints: Yup.array().of(Yup.string()),
    secondary_endpoints: Yup.array().of(Yup.string()),
    exploratory_endpoints: Yup.array().of(Yup.string()),
  }),
  study_design_details: Yup.object({
    number_of_arms: Yup.string(),
    stratification_factors: Yup.string(),
    study_duration: Yup.object({
      screening_period: Yup.string(),
      treatment_period: Yup.string(),
      follow_up_period: Yup.string(),
    }),
    sample_size: Yup.string(),
    number_of_sites: Yup.string(),
  }),
  study_assessments: Yup.object({
    efficacy_assessments: Yup.array().of(Yup.string()),
    safety_assessments: Yup.object({
      adverse_event_monitoring: Yup.string(),
      laboratory_tests: Yup.string(),
      vital_signs: Yup.string(),
    }),
    survival_analysis: Yup.object({
      overall_survival: Yup.string(),
      progression_free_survival: Yup.string(),
    }),
  }),
  statistical_considerations: Yup.object({
    statistical_hypothesis: Yup.string(),
    sample_size_justification: Yup.string(),
    interim_analysis_planned: Yup.boolean(),
    handling_of_missing_data: Yup.string(),
  }),
  regulatory_requirements: Yup.object({
    countries_for_submission: Yup.array().of(Yup.string()),
    planned_start_date: Yup.string(),
    irb_approvals_required: Yup.boolean(),
    informed_consent_required: Yup.boolean(),
  }),
  study_monitoring: Yup.object({
    data_collection_method: Yup.string(),
    monitoring_frequency: Yup.string(),
    monitoring_type: Yup.string(),
    key_contacts: Yup.object({
      sponsor_contact: Yup.string(),
      cro_contact: Yup.string(),
    }),
  }),
  additional_comments: Yup.string(),
});

// Initial values setup
const getInitialValues = (initialData) => {
  return {
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
    study_treatments: {
      investigational_product: {
        name: '',
        dose_schedule: '',
        route_of_administration: '',
      },
      comparator: {
        name: '',
        dose_schedule: '',
        route_of_administration: '',
      },
      concomitant_medications_allowed: '',
    },
    study_endpoints: {
      primary_endpoints: [''],
      secondary_endpoints: [''],
      exploratory_endpoints: [''],
    },
    study_design_details: {
      number_of_arms: '',
      stratification_factors: '',
      study_duration: {
        screening_period: '',
        treatment_period: '',
        follow_up_period: '',
      },
      sample_size: '',
      number_of_sites: '',
    },
    study_assessments: {
      efficacy_assessments: [''],
      safety_assessments: {
        adverse_event_monitoring: '',
        laboratory_tests: '',
        vital_signs: '',
      },
      survival_analysis: {
        overall_survival: '',
        progression_free_survival: '',
      },
    },
    statistical_considerations: {
      statistical_hypothesis: '',
      sample_size_justification: '',
      interim_analysis_planned: false,
      handling_of_missing_data: '',
    },
    regulatory_requirements: {
      countries_for_submission: [''],
      planned_start_date: '',
      irb_approvals_required: true,
      informed_consent_required: true,
    },
    study_monitoring: {
      data_collection_method: 'Electronic Data Capture (EDC)',
      monitoring_frequency: '',
      monitoring_type: 'On-Site',
      key_contacts: {
        sponsor_contact: '',
        cro_contact: '',
      },
    },
    additional_comments: '',
    ...initialData
  };
};

// Component function
const ClinicalIntakeForm = ({ onSubmit, initialData }) => {
  // Merge initialData with default values
  const startingValues = getInitialValues(initialData);

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Submitting form with values:', values); // Debug log
    onSubmit(values);
    setSubmitting(false);
  };

  // JSX Component
  return (
    <Formik
      initialValues={startingValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          {/* Study Identification Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              1. Study Identification
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_identification.study_title"
                  label="Study Title"
                  value={values.study_identification.study_title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_identification?.study_title && Boolean(errors.study_identification?.study_title)}
                  helperText={touched.study_identification?.study_title && errors.study_identification?.study_title}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_identification.protocol_number"
                  label="Protocol Number"
                  value={values.study_identification.protocol_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_identification?.protocol_number && Boolean(errors.study_identification?.protocol_number)}
                  helperText={touched.study_identification?.protocol_number && errors.study_identification?.protocol_number}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_identification.version_number_date"
                  label="Version Number/Date"
                  value={values.study_identification.version_number_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_identification?.version_number_date && Boolean(errors.study_identification?.version_number_date)}
                  helperText={touched.study_identification?.version_number_date && errors.study_identification?.version_number_date}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_identification.sponsor_name"
                  label="Sponsor Name"
                  value={values.study_identification.sponsor_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_identification?.sponsor_name && Boolean(errors.study_identification?.sponsor_name)}
                  helperText={touched.study_identification?.sponsor_name && errors.study_identification?.sponsor_name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_identification.cro"
                  label="CRO (if applicable)"
                  value={values.study_identification.cro}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Study Overview Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              2. Study Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_overview.therapeutic_area"
                  label="Therapeutic Area"
                  value={values.study_overview.therapeutic_area}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_overview?.therapeutic_area && Boolean(errors.study_overview?.therapeutic_area)}
                  helperText={touched.study_overview?.therapeutic_area && errors.study_overview?.therapeutic_area}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_overview.disease_indication"
                  label="Disease Indication (e.g., Type of Cancer)"
                  value={values.study_overview.disease_indication}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_overview?.disease_indication && Boolean(errors.study_overview?.disease_indication)}
                  helperText={touched.study_overview?.disease_indication && errors.study_overview?.disease_indication}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="study_overview.study_phase"
                  label="Study Phase"
                  value={values.study_overview.study_phase}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_overview?.study_phase && Boolean(errors.study_overview?.study_phase)}
                  helperText={touched.study_overview?.study_phase && errors.study_overview?.study_phase}
                >
                  {['Phase I', 'Phase II', 'Phase III', 'Phase IV'].map((phase) => (
                    <MenuItem key={phase} value={phase}>
                      {phase}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="study_overview.study_type"
                  label="Study Type"
                  value={values.study_overview.study_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_overview?.study_type && Boolean(errors.study_overview?.study_type)}
                  helperText={touched.study_overview?.study_type && errors.study_overview?.study_type}
                >
                  {['Interventional', 'Observational', 'Expanded Access'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="study_overview.blinding"
                  label="Blinding"
                  value={values.study_overview.blinding}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_overview?.blinding && Boolean(errors.study_overview?.blinding)}
                  helperText={touched.study_overview?.blinding && errors.study_overview?.blinding}
                >
                  {['Open-Label', 'Single-Blind', 'Double-Blind'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="study_overview.randomization"
                      checked={values.study_overview.randomization}
                      onChange={handleChange}
                    />
                  }
                  label="Randomization"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="study_overview.primary_objective"
                  label="Primary Objective"
                  value={values.study_overview.primary_objective}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_overview?.primary_objective && Boolean(errors.study_overview?.primary_objective)}
                  helperText={touched.study_overview?.primary_objective && errors.study_overview?.primary_objective}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="study_overview.secondary_objectives"
                  label="Secondary Objectives"
                  value={values.study_overview.secondary_objectives}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Target Population Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              3. Target Population
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="target_population.patient_population_description"
                  label="Patient Population Description"
                  value={values.target_population.patient_population_description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.target_population?.patient_population_description && Boolean(errors.target_population?.patient_population_description)}
                  helperText={touched.target_population?.patient_population_description && errors.target_population?.patient_population_description}
                />
              </Grid>
              
              {/* Inclusion Criteria */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Key Inclusion Criteria
                </Typography>
                <FieldArray name="target_population.key_inclusion_criteria">
                  {({ push, remove }) => (
                    <Box>
                      {values.target_population.key_inclusion_criteria.map((_, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                          <TextField
                            fullWidth
                            name={`target_population.key_inclusion_criteria.${index}`}
                            label={`Criterion ${index + 1}`}
                            value={values.target_population.key_inclusion_criteria[index]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <IconButton onClick={() => remove(index)}>
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => push('')}
                      >
                        Add Inclusion Criterion
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>
              
              {/* Exclusion Criteria */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
                  Key Exclusion Criteria
                </Typography>
                <FieldArray name="target_population.key_exclusion_criteria">
                  {({ push, remove }) => (
                    <Box>
                      {values.target_population.key_exclusion_criteria.map((_, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                          <TextField
                            fullWidth
                            name={`target_population.key_exclusion_criteria.${index}`}
                            label={`Criterion ${index + 1}`}
                            value={values.target_population.key_exclusion_criteria[index]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <IconButton onClick={() => remove(index)}>
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => push('')}
                      >
                        Add Exclusion Criterion
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Study Treatments Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              4. Study Treatments
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Investigational Product (IP)</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="study_treatments.investigational_product.name"
                  label="Name"
                  value={values.study_treatments.investigational_product.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_treatments?.investigational_product?.name && Boolean(errors.study_treatments?.investigational_product?.name)}
                  helperText={touched.study_treatments?.investigational_product?.name && errors.study_treatments?.investigational_product?.name}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="study_treatments.investigational_product.dose_schedule"
                  label="Dose and Schedule"
                  value={values.study_treatments.investigational_product.dose_schedule}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_treatments?.investigational_product?.dose_schedule && Boolean(errors.study_treatments?.investigational_product?.dose_schedule)}
                  helperText={touched.study_treatments?.investigational_product?.dose_schedule && errors.study_treatments?.investigational_product?.dose_schedule}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="study_treatments.investigational_product.route_of_administration"
                  label="Route of Administration"
                  value={values.study_treatments.investigational_product.route_of_administration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.study_treatments?.investigational_product?.route_of_administration && Boolean(errors.study_treatments?.investigational_product?.route_of_administration)}
                  helperText={touched.study_treatments?.investigational_product?.route_of_administration && errors.study_treatments?.investigational_product?.route_of_administration}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Comparator (if applicable)</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="study_treatments.comparator.name"
                  label="Name"
                  value={values.study_treatments.comparator.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="study_treatments.comparator.dose_schedule"
                  label="Dose and Schedule"
                  value={values.study_treatments.comparator.dose_schedule}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="study_treatments.comparator.route_of_administration"
                  label="Route of Administration"
                  value={values.study_treatments.comparator.route_of_administration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  name="study_treatments.concomitant_medications_allowed"
                  label="Concomitant Medications Allowed"
                  value={values.study_treatments.concomitant_medications_allowed}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Study Endpoints Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              5. Study Endpoints
            </Typography>
            <Grid container spacing={3}>
              {/* Primary Endpoints */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Primary Endpoint(s)
                </Typography>
                <FieldArray name="study_endpoints.primary_endpoints">
                  {({ push, remove }) => (
                    <Box>
                      {values.study_endpoints.primary_endpoints.map((_, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                          <TextField
                            fullWidth
                            name={`study_endpoints.primary_endpoints.${index}`}
                            label={`Endpoint ${index + 1}`}
                            value={values.study_endpoints.primary_endpoints[index]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <IconButton onClick={() => remove(index)}>
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => push('')}
                      >
                        Add Primary Endpoint
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>
              
              {/* Secondary Endpoints */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Secondary Endpoint(s)
                </Typography>
                <FieldArray name="study_endpoints.secondary_endpoints">
                  {({ push, remove }) => (
                    <Box>
                      {values.study_endpoints.secondary_endpoints.map((_, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                          <TextField
                            fullWidth
                            name={`study_endpoints.secondary_endpoints.${index}`}
                            label={`Endpoint ${index + 1}`}
                            value={values.study_endpoints.secondary_endpoints[index]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <IconButton onClick={() => remove(index)}>
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => push('')}
                      >
                        Add Secondary Endpoint
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>
              
              {/* Exploratory Endpoints */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Exploratory Endpoint(s) (if applicable)
                </Typography>
                <FieldArray name="study_endpoints.exploratory_endpoints">
                  {({ push, remove }) => (
                    <Box>
                      {values.study_endpoints.exploratory_endpoints.map((_, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                          <TextField
                            fullWidth
                            name={`study_endpoints.exploratory_endpoints.${index}`}
                            label={`Endpoint ${index + 1}`}
                            value={values.study_endpoints.exploratory_endpoints[index]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <IconButton onClick={() => remove(index)}>
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => push('')}
                      >
                        Add Exploratory Endpoint
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Study Design Details Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              6. Study Design Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_design_details.number_of_arms"
                  label="Number of Arms"
                  value={values.study_design_details.number_of_arms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_design_details.stratification_factors"
                  label="Stratification Factors"
                  value={values.study_design_details.stratification_factors}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Study Duration
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="study_design_details.study_duration.screening_period"
                  label="Screening Period"
                  value={values.study_design_details.study_duration.screening_period}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="study_design_details.study_duration.treatment_period"
                  label="Treatment Period"
                  value={values.study_design_details.study_duration.treatment_period}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="study_design_details.study_duration.follow_up_period"
                  label="Follow-Up Period"
                  value={values.study_design_details.study_duration.follow_up_period}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_design_details.sample_size"
                  label="Sample Size (Total)"
                  value={values.study_design_details.sample_size}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_design_details.number_of_sites"
                  label="Number of Sites (Planned)"
                  value={values.study_design_details.number_of_sites}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

                    {/* Study Assessments Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              7. Study Assessments
            </Typography>
            <Grid container spacing={3}>
              {/* Efficacy Assessments */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Efficacy Assessments (e.g., imaging, biomarkers)
                </Typography>
                <FieldArray name="study_assessments.efficacy_assessments">
                  {({ push, remove }) => (
                    <Box>
                      {values.study_assessments.efficacy_assessments.map((_, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                          <TextField
                            fullWidth
                            name={`study_assessments.efficacy_assessments.${index}`}
                            label={`Assessment ${index + 1}`}
                            value={values.study_assessments.efficacy_assessments[index]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <IconButton onClick={() => remove(index)}>
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => push('')}
                      >
                        Add Efficacy Assessment
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>
              
              {/* Safety Assessments */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Safety Assessments
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="study_assessments.safety_assessments.adverse_event_monitoring"
                      label="Adverse Event Monitoring"
                      value={values.study_assessments.safety_assessments.adverse_event_monitoring}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="study_assessments.safety_assessments.laboratory_tests"
                      label="Laboratory Tests"
                      value={values.study_assessments.safety_assessments.laboratory_tests}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="study_assessments.safety_assessments.vital_signs"
                      label="Vital Signs"
                      value={values.study_assessments.safety_assessments.vital_signs}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                </Grid>
              </Grid>
              
              {/* Survival Analysis */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Survival Analysis (if applicable)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="study_assessments.survival_analysis.overall_survival"
                      label="Overall Survival"
                      value={values.study_assessments.survival_analysis.overall_survival}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      name="study_assessments.survival_analysis.progression_free_survival"
                      label="Progression-Free Survival"
                      value={values.study_assessments.survival_analysis.progression_free_survival}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Statistical Considerations Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              8. Statistical Considerations
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="statistical_considerations.statistical_hypothesis"
                  label="Statistical Hypothesis"
                  value={values.statistical_considerations.statistical_hypothesis}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  name="statistical_considerations.sample_size_justification"
                  label="Sample Size Justification"
                  value={values.statistical_considerations.sample_size_justification}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      name="statistical_considerations.interim_analysis_planned"
                      checked={values.statistical_considerations.interim_analysis_planned}
                      onChange={handleChange}
                    />
                  }
                  label="Interim Analysis Planned"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="statistical_considerations.handling_of_missing_data"
                  label="Handling of Missing Data"
                  value={values.statistical_considerations.handling_of_missing_data}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Regulatory Requirements Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              9. Regulatory Requirements
            </Typography>
            <Grid container spacing={3}>
              {/* Countries for Submission */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Countries for Submission
                </Typography>
                <FieldArray name="regulatory_requirements.countries_for_submission">
                  {({ push, remove }) => (
                    <Box>
                      {values.regulatory_requirements.countries_for_submission.map((_, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                          <TextField
                            fullWidth
                            name={`regulatory_requirements.countries_for_submission.${index}`}
                            label={`Country ${index + 1}`}
                            value={values.regulatory_requirements.countries_for_submission[index]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <IconButton onClick={() => remove(index)}>
                            <RemoveIcon />
                          </IconButton>
                        </Box>
                      ))}
                      <Button
                        startIcon={<AddIcon />}
                        onClick={() => push('')}
                      >
                        Add Country
                      </Button>
                    </Box>
                  )}
                </FieldArray>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="regulatory_requirements.planned_start_date"
                  label="Planned Start Date"
                  value={values.regulatory_requirements.planned_start_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="regulatory_requirements.irb_approvals_required"
                      checked={values.regulatory_requirements.irb_approvals_required}
                      onChange={handleChange}
                    />
                  }
                  label="IRB Approvals Required"
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="regulatory_requirements.informed_consent_required"
                      checked={values.regulatory_requirements.informed_consent_required}
                      onChange={handleChange}
                    />
                  }
                  label="Informed Consent Required"
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Study Monitoring Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              10. Study Monitoring
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="study_monitoring.data_collection_method"
                  label="Data Collection Method"
                  value={values.study_monitoring.data_collection_method}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {['Electronic Data Capture (EDC)', 'Paper-Based CRF'].map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_monitoring.monitoring_frequency"
                  label="Monitoring Frequency"
                  value={values.study_monitoring.monitoring_frequency}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  name="study_monitoring.monitoring_type"
                  label="Monitoring Type"
                  value={values.study_monitoring.monitoring_type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {['On-Site', 'Remote'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_monitoring.key_contacts.sponsor_contact"
                  label="Sponsor Contact"
                  value={values.study_monitoring.key_contacts.sponsor_contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="study_monitoring.key_contacts.cro_contact"
                  label="CRO Contact"
                  value={values.study_monitoring.key_contacts.cro_contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Additional Comments Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              11. Additional Comments
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="additional_comments"
                  label="Additional Comments"
                  value={values.additional_comments}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Form Submission */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={isSubmitting}
              sx={{ px: 5 }}
            >
              Submit Form
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ClinicalIntakeForm;