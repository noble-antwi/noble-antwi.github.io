// Everything on /niw-consulting/ that is content rather than layout.
// Prices are USD. Change them here and the page follows.

export const NIW = {
  /** Where the inquiry form posts. The worker in /worker owns this address. */
  formEndpoint: 'https://forms.nobleantwi.com/inquiry',
  /** Cloudflare Turnstile site key. Leave empty until the widget exists. */
  turnstileSiteKey: '',
  disclaimer:
    'Noble Antwi is a writing and record-building consultant, not an attorney. He does not provide legal advice or represent petitioners before USCIS.',
};

export const FIELDS = [
  'Technology and cybersecurity',
  'Engineering',
  'Healthcare',
  'Research and academia',
  'Finance',
  'Education',
  'Public health',
  'Other',
];

export const DEGREES = ['Bachelor', 'Master', 'Doctorate', 'Professional degree', 'Other'];

export const TIMELINES = ['Under 6 months', '6 to 12 months', '12 to 18 months', 'More than 18 months', 'Not sure yet'];

export const DO = [
  'Individual record review and gap analysis',
  'Publication and speaking strategy',
  'Petition letter development through multi-round editorial work',
  'Recommendation letter frameworks',
  'Exhibit organisation and consistency checks',
];

export const DONT = [
  'I am not an attorney.',
  'I do not provide legal advice.',
  'I do not assess eligibility.',
  'I do not represent anyone before USCIS.',
  'Clients author, and are solely responsible for, their own filings.',
];

export interface Service {
  name: string;
  price: string;
  recommended?: boolean;
  note?: string;
  includes: string[];
}

export const SERVICES: Service[] = [
  {
    name: 'Record Assessment & Framework',
    price: '$450',
    includes: [
      'Individual background review',
      'Gap analysis',
      'Evidence-building framework with named target venues for your field',
      'Completed questionnaire package',
    ],
    note: 'Credited toward the Full Engagement within 60 days.',
  },
  {
    name: 'Full Engagement',
    price: '$2,800',
    recommended: true,
    includes: [
      'Everything in the assessment',
      'Multi-round petition letter development',
      'Recommendation letter frameworks and recommender questionnaires, up to 6',
      'Exhibit organisation and indexing',
      'Full consistency cross-check',
    ],
  },
  {
    name: 'Petition Letter Development',
    price: '$1,800',
    includes: [
      'Deep intake interviews',
      'Structural framework',
      'Three rounds of substantive editing',
      'Claim-to-evidence cross-check',
    ],
  },
];

export const ADDONS = [
  { name: 'Exhibit organisation, standalone', price: '$600' },
  { name: 'Additional recommendation letter framework', price: '$150 each' },
  { name: 'Single strategy session, 60 minutes', price: '$200' },
];

export const RETAINER = {
  name: 'Record-building retainer',
  price: '$400 / month',
  terms: 'Six-month minimum.',
  who: 'For people 12 to 18 months out from filing who want the record built steadily rather than assembled at the end.',
};

export const STEPS = [
  { title: 'Consultation', body: 'A conversation about where you are, what you have, and when you hope to file.' },
  { title: 'Individual case review and gap analysis', body: 'I read your full background: education, work history, publications, projects and professional standing. Then I say plainly what is strong and what is missing.' },
  { title: 'Evidence-building framework', body: 'A written plan for closing the gaps, with the venues, activities and documents that count as evidence in your field.' },
  { title: 'Iterative drafting and review', body: 'The petition letter and recommendation frameworks take shape over several rounds, each one tightened against the evidence.' },
  { title: 'Final package handoff', body: 'Organised, indexed and cross-checked, ready for you and your attorney to review and file.' },
];
