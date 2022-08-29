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

export const userCaseWith6Respondent = {
  id: '12354',
  state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
  respondents: [
    {
      respondentNumber: 1,
      respondentName: 'Globo Gym 1',
    },
    {
      respondentNumber: 2,
      respondentName: 'Globo Gym 2',
    },
    {
      respondentNumber: 3,
      respondentName: 'Globo Gym 3',
    },
    {
      respondentNumber: 4,
      respondentName: 'Globo Gym 4',
    },
    {
      respondentNumber: 5,
      respondentName: 'Globo Gym 5',
    },
    {
      respondentNumber: 6,
      respondentName: 'Globo Gym 6',
    },
  ],
};
