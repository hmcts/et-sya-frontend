export default [
  'withdraw',
  'change-details',
  'postpone',
  'vary',
  'reconsider-decision',
  'amend',
  'respondent',
  'witness',
  'non-compliance',
  'publicity',
  'strike',
  'reconsider-judgement',
  'other',
  'documents',
];

export const applicationTypes = {
  claimant: {
    a: ['amend', 'non-compliance', 'other', 'respondent', 'postpone', 'publicity', 'strike', 'vary'],
    b: ['withdraw', 'change-details', 'reconsider-decision', 'reconsider-judgement'],
    c: 'witness',
  },
  respondent: {
    a: [
      'Amend response',
      'Claimant not complied',
      'Contact the tribunal',
      'Order other party',
      'Postpone a hearing',
      'Restrict publicity',
      'Strike out all or part of a claim',
      'Vary or revoke an order',
    ],
    b: ['Change personal details', 'Consider a decision afresh', 'Reconsider judgement'],
    c: 'Order a witness to attend to give evidence',
  },
};

export const APP_TYPE_MAP: { [key: string]: string } = {
  withdraw: 'Withdraw all/part of claim',
  'change-details': 'Change my personal details',
  postpone: 'Postpone a hearing',
  vary: 'Vary/revoke an order',
  'reconsider-decision': 'Consider a decision afresh',
  amend: 'Amend my claim',
  respondent: 'Order respondent to do something',
  witness: 'Order a witness to attend',
  'non-compliance': 'Tell tribunal respondent not complied',
  publicity: 'Restrict publicity',
  strike: 'Strike out all/part of response',
  'reconsider-judgement': 'Reconsider judgement',
  other: 'Contact about something else',
};
