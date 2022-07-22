import { CaseState } from '../../../main/definitions/definition';

export const userCaseWithRespondent = {
  id: '12354',
  state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
  respondents: [
    {
      respondentNumber: 1,
      respondentName: 'Globo Gym',
    },
  ],
};
