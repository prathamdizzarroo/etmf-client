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
  }),
});

const ClinicalIntakeForm = ({ onSubmit, initialData }) => {
  // Merge initialData with default values
  const startingValues = {
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
    ...initialData
  };

  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Submitting form with values:', values); // Debug log
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={startingValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          {/* Study Identification Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Study Identification
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
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Study Overview Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Study Overview
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
                >
                  {['Open-Label', 'Single-Blind', 'Double-Blind'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
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
            </Grid>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Target Population Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Target Population
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="target_population.patient_population_description"
                  label="Patient Population Description"
                  value={values.target_population.patient_population_description}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
            >
              Next
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ClinicalIntakeForm; 