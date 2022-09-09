import {
  getSectionStatus,
  isPostcodeMVPLocation,
  setUserCaseWithRedisData,
} from '../../../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../../../main/definitions/case';
import { sectionStatus } from '../../../../main/definitions/definition';
import { mockSession } from '../../mocks/mockApp';
import { mockRequest } from '../../mocks/mockRequest';

describe('getSectionStatus()', () => {
  it.each([
    {
      detailsCheckValue: YesOrNo.YES,
      sessionValue: undefined,
      expected: sectionStatus.completed,
    },
    {
      detailsCheckValue: YesOrNo.NO,
      sessionValue: undefined,
      expected: sectionStatus.inProgress,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: undefined,
      expected: sectionStatus.notStarted,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 'a string',
      expected: sectionStatus.inProgress,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 0,
      expected: sectionStatus.notStarted,
    },
    {
      detailsCheckValue: undefined,
      sessionValue: 1,
      expected: sectionStatus.inProgress,
    },
  ])('checks section status for task list page when %o', ({ detailsCheckValue, sessionValue, expected }) => {
    const providedStatus = getSectionStatus(detailsCheckValue, sessionValue);
    expect(providedStatus).toStrictEqual(expected);
  });
});

describe('isPostcodeMVPLocation()', () => {
  it.each([
    { postcode: 'G22 6LZ', expected: true }, // Glasgow
    { postcode: 'G32 7RH', expected: true }, // Glasgow
    { postcode: 'G20 9TA', expected: true }, // Glasgow
    { postcode: 'LS9 8FF', expected: true }, // Leeds
    { postcode: 'LS146AD', expected: true }, // Leeds
    { postcode: 'LS124AT', expected: true }, // Leeds
    { postcode: 'EH12 9FZ', expected: true }, // Edinburgh
    { postcode: 'EH12 8XL', expected: true },
    { postcode: 'TD1 1AA', expected: true },
    { postcode: 'TD1 1AB', expected: true },
    { postcode: 'TD1 1AD', expected: true },
    { postcode: 'TD14 5AA', expected: true },
    { postcode: 'ZE1 0AA', expected: true }, //  Lerwick
    { postcode: 'AB1 0AA', expected: true }, // Aberdeen
    { postcode: 'ML1 1AJ', expected: true }, // Motherwell
    { postcode: 'HS1 2AA', expected: true }, // Outer Hebrides
    { postcode: 'HS5 3TT', expected: true },
    { postcode: 'KA1 1AA', expected: true }, // Kilmarnock
    { postcode: 'IV32 7HN', expected: true }, // Inverness
    { postcode: 'OL14 5AA', expected: true }, // Oldham
    { postcode: '1', expected: false },
    { postcode: '2', expected: false },
    { postcode: '100', expected: false },
    { postcode: '', expected: false },
    { postcode: 'TD15 1AA', expected: false },
    { postcode: 'ISE2 0YN', expected: false }, // London
    { postcode: 'W6 9AW', expected: false },
    { postcode: 'SE12 0LJ', expected: false },
    { postcode: 'E4 7AJ', expected: false },
    { postcode: 'E15 1FE', expected: false },
    { postcode: 'N16 6PH', expected: false },
    { postcode: 'E2 6GU', expected: false },
    { postcode: 'W3 7NX', expected: false },
    { postcode: 'E8 1LW', expected: false },
    { postcode: 'E2 6NR', expected: false },
    { postcode: 'LU7 0EU', expected: false }, // Luton
    { postcode: 'LE3 1EP', expected: false }, // Leicester
    { postcode: 'M41 8PX', expected: false }, // Manchester
    { postcode: 'NE289QH', expected: false }, // Newcastle
    { postcode: 'LE3 1EP', expected: false }, // Leicester
    { postcode: 'TD12 4AA', expected: false },
    { postcode: 'TD12 4AH', expected: false },
    { postcode: 'OL2 5AA', expected: false },
  ])('Check if postcode is an MVP location %o', ({ postcode, expected }) => {
    expect(isPostcodeMVPLocation(postcode)).toEqual(expected);
  });
});

describe('setUserCaseWithRedisData', () => {
  it(
    'should set req.session.userCase when setUserCaseWithRedisData is called with correspondent' +
      'req, and caseData parameters',
    () => {
      const req = mockRequest({ session: mockSession([], [], []) });
      const caseData =
        '[["claimantRepresentedQuestion","No"],["caseType","Multiple"],["typeOfClaim","[\\"breachOfContract\\",\\"discrimination\\",\\"payRelated\\",\\"unfairDismissal\\",\\"whistleBlowing\\"]"]]';

      setUserCaseWithRedisData(req, caseData);

      expect(JSON.stringify(req.session.userCase)).toEqual(
        '{"id":"testUserCaseId","state":"AWAITING_SUBMISSION_TO_HMCTS","typeOfClaim":["breachOfContract","discrimination","payRelated","unfairDismissal","whistleBlowing"],"tellUsWhatYouWant":[],"claimantRepresentedQuestion":"No","caseType":"Multiple"}'
      );
    }
  );

  it(
    'should set req.session.userCase when setUserCaseWithRedisData is called with correspondent' +
      'req, and caseData, session.usercase is undefined',
    () => {
      const req = mockRequest({ userCase: undefined, session: mockSession([], [], []) });
      req.session.userCase = undefined;
      const caseData =
        '[["claimantRepresentedQuestion","No"],["caseType","Multiple"],["typeOfClaim","[\\"breachOfContract\\",\\"discrimination\\",\\"payRelated\\",\\"unfairDismissal\\",\\"whistleBlowing\\"]"]]';

      setUserCaseWithRedisData(req, caseData);

      expect(JSON.stringify(req.session.userCase)).toEqual(
        '{"claimantRepresentedQuestion":"No","caseType":"Multiple","typeOfClaim":["breachOfContract","discrimination","payRelated","unfairDismissal","whistleBlowing"]}'
      );
    }
  );
});
