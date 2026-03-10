import { ContactTheTribunalHelper } from '../../../../main/controllers/helpers/ContactTheTribunalHelper';
import { CaseWithId, YesOrNo } from '../../../../main/definitions/case';
import { CaseState } from '../../../../main/definitions/definition';

describe('ContactTheTribunalHelper tests', () => {
  describe('isClaimantRepresentedByOrganisation tests', () => {
    const DATE = 'August 19, 2022';
    it('should return false when user case is undefined', () => {
      expect(ContactTheTribunalHelper.isClaimantRepresentedByOrganisation(undefined)).toBe(false);
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
      expect(ContactTheTribunalHelper.isClaimantRepresentedByOrganisation(userCase)).toBe(false);
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
      expect(ContactTheTribunalHelper.isClaimantRepresentedByOrganisation(userCase)).toBe(false);
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
      expect(ContactTheTribunalHelper.isClaimantRepresentedByOrganisation(userCase)).toBe(false);
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
      expect(ContactTheTribunalHelper.isClaimantRepresentedByOrganisation(userCase)).toBe(false);
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
      expect(ContactTheTribunalHelper.isClaimantRepresentedByOrganisation(userCase)).toBe(false);
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
      expect(ContactTheTribunalHelper.isClaimantRepresentedByOrganisation(userCase)).toBe(true);
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
      expect(ContactTheTribunalHelper.isClaimantRepresentedByOrganisation(userCase)).toBe(true);
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
      expect(ContactTheTribunalHelper.isClaimantRepresentedByOrganisation(userCase)).toBe(false);
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
      expect(ContactTheTribunalHelper.isClaimantRepresentedByOrganisation(userCase)).toBe(true);
    });
  });
});
