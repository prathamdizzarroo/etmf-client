
export const getPredefinedSections = () => [
  {
    title: 'PROTOCOL SUMMARY',
    context: 'This section should provide a concise overview of the entire clinical trial protocol. It should include key information about the trial design, objectives, population, interventions, and endpoints.',
    output: '',
    prompt: 'Write a comprehensive protocol summary for a clinical trial. Include brief information about the trial design, primary objectives, study population, intervention details, and key endpoints. Keep it concise but informative for quick reference.'
  },
  {
    title: 'INTRODUCTION',
    context: 'This section should cover the purpose of the trial, background information, trial rationale, and a thorough analysis of benefits and risks.',
    output: '',
    prompt: 'Write an introduction for a clinical trial protocol that includes: 1) The purpose of the trial, 2) Background information on the condition and intervention being studied, 3) Detailed rationale for conducting the trial, and 4) A comprehensive benefits and risks analysis for trial participants.'
  },
  {
    title: 'TRIAL OBJECTIVES, ENDPOINTS, AND ESTIMANDS',
    context: 'This section should clearly define the primary and secondary objectives of the trial, the specific endpoints that will be measured, and the estimands (precise definition of the treatment effect to be estimated).',
    output: '',
    prompt: 'Define the objectives, endpoints, and estimands for a clinical trial protocol. Include primary and secondary objectives, specific measurable endpoints for each objective, and clearly defined estimands that specify the treatment effect of interest, handling of intercurrent events, and the population-level summary.'
  },
  {
    title: 'TRIAL DESIGN',
    context: 'This section should describe the overall design of the trial, including study type, randomization procedures, blinding methods, duration, and study phases.',
    output: '',
    prompt: 'Describe a comprehensive clinical trial design including: study type (e.g., randomized, controlled, parallel-group), randomization procedures, blinding methods (if applicable), overall duration, number of arms, allocation ratio, phase designation, and interim analyses (if planned).'
  },
  {
    title: 'TRIAL POPULATION',
    context: 'This section should define the target population for the trial, including inclusion and exclusion criteria, screening procedures, and strategies for recruitment and retention.',
    output: '',
    prompt: 'Define the trial population for a clinical study, including detailed inclusion and exclusion criteria, screening procedures, strategies for recruitment and retention, and justification for the selected population. Address any special populations that may be included or excluded and the rationale for these decisions.'
  },
  {
    title: 'TRIAL INTERVENTION AND CONCOMITANT THERAPY',
    context: 'This section should provide detailed information about the intervention(s) being studied, including dosage, administration, and any concomitant therapies that are permitted or prohibited.',
    output: '',
    prompt: 'Describe the trial intervention and concomitant therapy guidelines for a clinical protocol. Include detailed information about the intervention(s) being studied (formulation, dosage, route of administration, treatment duration), procedures for ensuring compliance, rules for dose modifications, and a comprehensive list of permitted and prohibited concomitant medications/treatments.'
  },
  {
    title: 'DISCONTINUATION OF TRIAL INTERVENTION(S) AND PARTICIPANT WITHDRAWAL FROM THE TRIAL',
    context: 'This section should outline the criteria and procedures for discontinuing the trial intervention or withdrawing participants from the trial, including follow-up procedures for withdrawn participants.',
    output: '',
    prompt: 'Detail the procedures and criteria for discontinuation of trial interventions and participant withdrawal from a clinical trial. Include specific criteria for temporary or permanent discontinuation of intervention, procedures for participant withdrawal, data collection for withdrawn participants, replacement policies, and follow-up procedures for participants who discontinue.'
  },
  {
    title: 'TRIAL ASSESSMENTS AND PROCEDURES',
    context: 'This section should describe all assessments and procedures that will be performed during the trial, including the schedule of assessments, methods for data collection, and any special procedures or tests.',
    output: '',
    prompt: 'Create a comprehensive description of trial assessments and procedures for a clinical protocol. Include the complete schedule of assessments (screening, baseline, treatment, follow-up visits), detailed methods for all efficacy, safety, and other assessments, specimen collection procedures, and timing of each procedure throughout the trial.'
  },
  {
    title: 'STATISTICAL CONSIDERATIONS',
    context: 'This section should describe the statistical methods that will be used to analyze the trial data, including sample size calculations, analysis populations, and methods for handling missing data.',
    output: '',
    prompt: 'Outline the statistical considerations for a clinical trial protocol. Include sample size justification with power calculations, definition of analysis populations (ITT, PP, safety), primary and secondary analysis methods, multiplicity adjustments, interim analyses (if applicable), and approaches for handling missing data and protocol deviations.'
  },
  {
    title: 'GENERAL CONSIDERATIONS: REGULATORY, ETHICAL, AND TRIAL OVERSIGHT',
    context: 'This section should address regulatory and ethical considerations for the trial, including IRB/EC approval, informed consent procedures, and trial oversight mechanisms.',
    output: '',
    prompt: 'Describe the regulatory, ethical, and oversight considerations for a clinical trial. Include information about regulatory compliance (ICH-GCP, applicable regulations), ethics committee/IRB review and approval process, informed consent procedures, participant confidentiality measures, and trial oversight structures (committees, monitoring, auditing).'
  },
  {
    title: 'GENERAL CONSIDERATIONS: RISK MANAGEMENT AND QUALITY ASSURANCE',
    context: 'This section should outline the risk management and quality assurance procedures for the trial, including quality tolerance limits, data quality assurance, monitoring and inspections, data collection, and data management.',
    output: '',
    prompt: 'Detail the risk management and quality assurance procedures for a clinical trial. Include quality tolerance limits, data quality assurance measures, monitoring and inspection procedures, data collection methods, electronic data capture systems, data management processes, and validation procedures to ensure data integrity and compliance with regulatory requirements.'
  },
  {
    title: 'LIST OF APPENDICES',
    context: 'This section should list all appendices to the protocol, including any supplementary materials, detailed procedures, or additional information that supports the main protocol.',
    output: '',
    prompt: 'Create a comprehensive list of appendices for a clinical trial protocol. Include titles and brief descriptions for each appendix, such as detailed assessment procedures, questionnaires/scales, laboratory procedures, RECIST criteria, CTCAE grading, drug preparation instructions, and any other supplementary materials referenced in the main protocol.'
  }
];
