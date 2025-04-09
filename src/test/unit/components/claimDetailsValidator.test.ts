import {
  validateClaimCheckDetails,
  validateEmploymentAndRespondentDetails,
  validatePersonalDetails,
} from '../../../main/components/form/claimDetailsValidator';

describe('claimDetailsValidator', () => {
  describe('validatePersonalDetails', () => {
    it('should return false if userCase is undefined', () => {
      expect(validatePersonalDetails(undefined)).toBe(false);
    });

    it('should return false if any required field is missing', () => {
      const userCase = {
        typeOfClaim: 'Type1',
        reasonableAdjustments: 'None',
        personalDetailsCheck: 'Yes',
        hearingPreferences: ['VIDEO'],
        claimantContactPreference: 'Email',
        claimantContactLanguagePreference: 'English',
        address1: '123 Street',
        addressTown: 'Town',
      };
      expect(validatePersonalDetails(userCase)).toBe(false);
    });

    it('should return true if all required fields are present', () => {
      const userCase = {
        typeOfClaim: 'Type1',
        reasonableAdjustments: 'None',
        personalDetailsCheck: 'Yes',
        hearingPreferences: ['VIDEO'],
        claimantContactPreference: 'Email',
        claimantContactLanguagePreference: 'English',
        claimantHearingLanguagePreference: 'English',
        address1: '123 Street',
        addressTown: 'Town',
        addressPostcode: 'AB12 3CD',
      };
      expect(validatePersonalDetails(userCase)).toBe(true);
    });
  });

  describe('validateEmploymentAndRespondentDetails', () => {
    it('should return false if userCase is undefined', () => {
      expect(validateEmploymentAndRespondentDetails(undefined)).toBe(false);
    });

    it('should return false if pastEmployer is "Yes" and startDate is missing', () => {
      const userCase = {
        pastEmployer: 'Yes',
        isStillWorking: 'No',
        claimantWorkAddressQuestion: '123 Work Street',
        respondentEnterPostcode: 'SW1A 1AA',
      };
      expect(validateEmploymentAndRespondentDetails(userCase)).toBe(false);
    });

    it('should return false if isStillWorking is "Notice" and noticeEnds is missing', () => {
      const userCase = {
        pastEmployer: 'No',
        isStillWorking: 'Notice',
        startDate: { year: '2022', month: '01', day: '01' },
        claimantWorkAddressQuestion: '123 Work Street',
        respondentEnterPostcode: 'SW1A 1AA',
      };
      expect(validateEmploymentAndRespondentDetails(userCase)).toBe(false);
    });

    it('should return true if all required fields are present', () => {
      const userCase = {
        pastEmployer: 'Yes',
        startDate: { year: '2022', month: '01', day: '01' },
        isStillWorking: 'Notice',
        noticeEnds: { year: '2023', month: '12', day: '31' },
        claimantWorkAddressQuestion: '123 Work Street',
        respondentEnterPostcode: 'SW1A 1AA',
      };
      expect(validateEmploymentAndRespondentDetails(userCase)).toBe(true);
    });
  });

  describe('validateClaimCheckDetails', () => {
    it('should return false if userCase is undefined', () => {
      expect(validateClaimCheckDetails(undefined)).toBe(false);
    });

    it('should return false if claimTypePay is not a non-empty array', () => {
      const userCase = { claimSummaryText: 'Summary' };
      expect(validateClaimCheckDetails(userCase)).toBe(false);
    });

    it('should return false if claimSummaryText is missing or empty', () => {
      const userCase = { claimTypePay: ['Type1'], claimSummaryText: '' };
      expect(validateClaimCheckDetails(userCase)).toBe(false);
    });

    it('should return true if all required fields are valid', () => {
      const userCase = { claimTypePay: ['Type1'], claimSummaryText: 'Summary' };
      expect(validateClaimCheckDetails(userCase)).toBe(true);
    });
  });
});
