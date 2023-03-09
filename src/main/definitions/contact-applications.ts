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
];

export const applicationTypes = {
  claimant: {
    a: ['amend', 'non-compliance', 'other', 'order', 'postpone', 'publicity', 'strike', 'vary'],
    b: ['change-details', 'reconsider-decision', 'reconsider-judgement'],
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
