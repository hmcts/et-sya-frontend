import { CaseState } from '../../../main/definitions/definition';

export const userCaseWithRespondent = {
  id: '12354',
  state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
  selectedRespondent: 1,
  respondents: [
    {
      respondentNumber: 1,
      respondentName: 'Globo Gym',
    },
  ],
};
