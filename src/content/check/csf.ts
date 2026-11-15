/* The 22 categories of the NIST Cybersecurity Framework 2.0 (NIST CSWP 29, 26 February 2024), by identifier,
   exactly as the framework names them. Read from the publication on 2026-11-04. */

export const CSF_SOURCE = { label: 'NIST Cybersecurity Framework 2.0', url: 'https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf' };

export const CSF_FUNCTIONS: Record<string, string> = {
  GV: 'Govern', ID: 'Identify', PR: 'Protect', DE: 'Detect', RS: 'Respond', RC: 'Recover',
};

export const CSF_CATEGORIES: Record<string, string> = {
  'GV.OC': 'Organizational Context',
  'GV.RM': 'Risk Management Strategy',
  'GV.RR': 'Roles, Responsibilities, and Authorities',
  'GV.PO': 'Policy',
  'GV.OV': 'Oversight',
  'GV.SC': 'Cybersecurity Supply Chain Risk Management',
  'ID.AM': 'Asset Management',
  'ID.RA': 'Risk Assessment',
  'ID.IM': 'Improvement',
  'PR.AA': 'Identity Management, Authentication, and Access Control',
  'PR.AT': 'Awareness and Training',
  'PR.DS': 'Data Security',
  'PR.PS': 'Platform Security',
  'PR.IR': 'Technology Infrastructure Resilience',
  'DE.CM': 'Continuous Monitoring',
  'DE.AE': 'Adverse Event Analysis',
  'RS.MA': 'Incident Management',
  'RS.AN': 'Incident Analysis',
  'RS.CO': 'Incident Response Reporting and Communication',
  'RS.MI': 'Incident Mitigation',
  'RC.RP': 'Incident Recovery Plan Execution',
  'RC.CO': 'Incident Recovery Communication',
};

export const csfName = (id: string) => CSF_CATEGORIES[id] || id;
export const csfFunction = (id: string) => CSF_FUNCTIONS[id.slice(0, 2)] || '';
