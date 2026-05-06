import {
  getApplicationsAccordionItems,
  isClaimantRepresentedByOrganisation,
} from '../../../../main/controllers/helpers/ContactTheTribunalHelper';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { CaseState } from '../../../../main/definitions/definition';
import contactTribunalRaw from '../../../../main/resources/locales/en/translation/contact-the-tribunal.json';
import { mockHearingCollection } from '../../mocks/mockHearing';
import { mockRequestWithTranslation } from '../../mocks/mockRequest';
import mockUserCase from '../../mocks/mockUserCase';

describe('ContactTheTribunalHelper tests', () => {
  describe('isClaimantRepresentedByOrganisation tests', () => {
    const DATE = 'August 19, 2022';
    it('should return false when user case is undefined', () => {
      expect(isClaimantRepresentedByOrganisation(undefined)).toBe(false);
    });

    it('should return false when user case claimant represented question is undefined', () => {
      const userCase: CaseWithId = {
        id: '1',
        state: CaseState.SUBMITTED,
        createdDate: DATE,
        lastModified: DATE,
        respondents: undefined,
        et3ResponseReceived: true,
      };
      expect(isClaimantRepresentedByOrganisation(userCase)).toBe(false);
    });

    it('should return false when user case claimant represented question is not equal to Yes', () => {
      const userCase: CaseWithId = {
        id: '1',
        state: CaseState.SUBMITTED,
        createdDate: DATE,
        lastModified: DATE,
        respondents: undefined,
        et3ResponseReceived: true,
        claimantRepresentedQuestion: YesOrNo.NO,
      };
      expect(isClaimantRepresentedByOrganisation(userCase)).toBe(false);
    });

    it('should return false when user case claimant representative organisation policy is undefined', () => {
      const userCase: CaseWithId = {
        id: '1',
        state: CaseState.SUBMITTED,
        createdDate: DATE,
        lastModified: DATE,
        respondents: undefined,
        et3ResponseReceived: true,
        claimantRepresentedQuestion: YesOrNo.YES,
      };
      expect(isClaimantRepresentedByOrganisation(userCase)).toBe(false);
    });

    it('should return false when user case claimant representative organisation is undefined', () => {
      const userCase: CaseWithId = {
        id: '1',
        state: CaseState.SUBMITTED,
        createdDate: DATE,
        lastModified: DATE,
        respondents: undefined,
        et3ResponseReceived: true,
        claimantRepresentedQuestion: YesOrNo.YES,
        claimantRepresentativeOrganisationPolicy: {
          Organisation: undefined,
        },
      };
      expect(isClaimantRepresentedByOrganisation(userCase)).toBe(false);
    });

    it('should return false when user case claimant representative organisation both id and name are undefined', () => {
      const userCase: CaseWithId = {
        id: '1',
        state: CaseState.SUBMITTED,
        createdDate: DATE,
        lastModified: DATE,
        respondents: undefined,
        et3ResponseReceived: true,
        claimantRepresentedQuestion: YesOrNo.YES,
        claimantRepresentativeOrganisationPolicy: {
          Organisation: {
            OrganisationID: undefined,
            OrganisationName: undefined,
          },
        },
      };
      expect(isClaimantRepresentedByOrganisation(userCase)).toBe(false);
    });

    it('should return true when user case claimant representative organisation id is not empty', () => {
      const userCase: CaseWithId = {
        id: '1',
        state: CaseState.SUBMITTED,
        createdDate: DATE,
        lastModified: DATE,
        respondents: undefined,
        et3ResponseReceived: true,
        claimantRepresentedQuestion: YesOrNo.YES,
        claimantRepresentativeOrganisationPolicy: {
          Organisation: {
            OrganisationID: 'dummyId',
            OrganisationName: undefined,
          },
        },
      };
      expect(isClaimantRepresentedByOrganisation(userCase)).toBe(true);
    });

    it('should return true when user case claimant representative both organisation name and id are not empty', () => {
      const userCase: CaseWithId = {
        id: '1',
        state: CaseState.SUBMITTED,
        createdDate: DATE,
        lastModified: DATE,
        respondents: undefined,
        et3ResponseReceived: true,
        claimantRepresentedQuestion: YesOrNo.YES,
        claimantRepresentativeOrganisationPolicy: {
          Organisation: {
            OrganisationID: 'dummyId',
            OrganisationName: 'dummyName',
          },
        },
      };
      expect(isClaimantRepresentedByOrganisation(userCase)).toBe(true);
    });

    it('should return false when user case claimant representative organisation policy undefined and claimant representative does not have MyHmcts organisation', () => {
      const userCase: CaseWithId = {
        id: '1',
        state: CaseState.SUBMITTED,
        createdDate: DATE,
        lastModified: DATE,
        respondents: undefined,
        et3ResponseReceived: true,
        claimantRepresentedQuestion: YesOrNo.YES,
        claimantRepresentativeOrganisationPolicy: undefined,
        claimantRepresentative: {
          myHmctsOrganisation: undefined,
        },
      };
      expect(isClaimantRepresentedByOrganisation(userCase)).toBe(false);
    });

    it('should return false when user case claimant representative organisation policy undefined and claimant representative have MyHmcts organisation', () => {
      const userCase: CaseWithId = {
        id: '1',
        state: CaseState.SUBMITTED,
        createdDate: DATE,
        lastModified: DATE,
        respondents: undefined,
        et3ResponseReceived: true,
        claimantRepresentedQuestion: YesOrNo.YES,
        claimantRepresentativeOrganisationPolicy: undefined,
        claimantRepresentative: {
          myHmctsOrganisation: {
            OrganisationID: 'dummyId',
          },
        },
      };
      expect(isClaimantRepresentedByOrganisation(userCase)).toBe(true);
    });
  });

  describe('getApplicationsAccordionItems tests', () => {
    it('should return all applications includes documents', () => {
      const translationJsons = { ...contactTribunalRaw };
      const request = mockRequestWithTranslation({ userCase: mockUserCase }, translationJsons);
      request.session.userCase.hearingCollection = mockHearingCollection;

      const actual = getApplicationsAccordionItems(request, true, false);

      expect(actual).toHaveLength(14);
      expect(actual[0]).toStrictEqual({
        heading: {
          text: 'Give notice that I want to withdraw all or part of my claim',
        },
        content: {
          html:
            '<p class="govuk-body">When you\'ve reached a settlement or do not want to continue with your claim.</p>' +
            '<p class="govuk-body"><a class="govuk-link" href="/contact-the-tribunal/withdraw?lng=en">Give notice that I want to withdraw all or part of my claim</a></p>',
        },
      });
    });

    it('should return all applications except documents', () => {
      const translationJsons = { ...contactTribunalRaw };
      const request = mockRequestWithTranslation({ userCase: mockUserCase }, translationJsons);

      const actual = getApplicationsAccordionItems(request, false, false);

      expect(actual).toHaveLength(13);
    });

    it('should not return any if claimant is legally represented', () => {
      const translationJsons = { ...contactTribunalRaw };
      const request = mockRequestWithTranslation({ userCase: mockUserCase }, translationJsons);

      const actual = getApplicationsAccordionItems(request, false, true);

      expect(actual).toHaveLength(0);
    });
  });
});
