import {
  validateClaimCheckDetails,
  validateEmploymentAndRespondentDetails,
  validatePersonalDetails,
} from '../../../main/components/form/claim-details-validator';

describe('claimDetailsValidator', () => {
  describe('validatePersonalDetails', () => {
    it('should return false if userCase is undefined', () => {
      expect(validatePersonalDetails(undefined)).toBe(false);
    });

    it('should return false if any address field is missing', () => {
      const userCase = {
        typeOfClaim: ['Type1'],
        address1: '123 Street',
        addressTown: 'Town',
        addressPostcode: 'AB12 3CD',
      };
      expect(validatePersonalDetails(userCase)).toBe(false);
    });

    it('should return true if all required fields are present and valid', () => {
      const userCase = {
        typeOfClaim: ['Type1'],
        address1: '123 Street',
        addressTown: 'Town',
        addressPostcode: 'AB12 3CD',
        addressCountry: 'Country',
      };
      expect(validatePersonalDetails(userCase)).toBe(true);
    });
  });

  describe('validateEmploymentAndRespondentDetails', () => {
    it('should return false if userCase is undefined', () => {
      expect(validateEmploymentAndRespondentDetails(undefined)).toBe(false);
    });

    it('should return false if any respondent address field is missing', () => {
      const userCase = {
        respondents: [
          {
            respondentAddress1: '123 Street',
            respondentAddressTown: 'Town',
            respondentAddressCountry: 'Country',
          },
        ],
      };
      expect(validateEmploymentAndRespondentDetails(userCase)).toBe(false);
    });

    it('should return false if acasCert is "No" and noAcasReason is missing', () => {
      const userCase = {
        respondents: [
          {
            respondentAddress1: '123 Street',
            respondentAddressTown: 'Town',
            respondentAddressCountry: 'Country',
            respondentAddressPostcode: 'AB12 3CD',
            acasCert: 'No',
          },
        ],
      };
      expect(validateEmploymentAndRespondentDetails(userCase)).toBe(false);
    });

    it('should return true if all required respondent fields are present and valid', () => {
      const userCase = {
        respondents: [
          {
            respondentAddress1: '123 Street',
            respondentAddressTown: 'Town',
            respondentAddressCountry: 'Country',
            respondentAddressPostcode: 'AB12 3CD',
            acasCert: 'No',
            noAcasReason: 'Valid reason',
          },
        ],
      };
      expect(validateEmploymentAndRespondentDetails(userCase)).toBe(true);
    });

    it('should return false if acasCert is "Yes" and acasCertNum is not provided', () => {
      const userCase = {
        respondents: [
          {
            respondentAddress1: '123 Street',
            respondentAddressTown: 'Town',
            respondentAddressCountry: 'Country',
            respondentAddressPostcode: 'AB12 3CD',
            acasCert: 'Yes',
          },
        ],
      };
      expect(validateEmploymentAndRespondentDetails(userCase)).toBe(false);
    });

    it('should return true if acasCert is "Yes" and acasCertNum is provided', () => {
      const userCase = {
        respondents: [
          {
            respondentAddress1: '123 Street',
            respondentAddressTown: 'Town',
            respondentAddressCountry: 'Country',
            respondentAddressPostcode: 'AB12 3CD',
            acasCert: 'Yes',
            acasCertNum: '123456',
          },
        ],
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
      const userCase = { typeOfClaim: ['Type1'], claimSummaryText: 'Summary' };
      expect(validateClaimCheckDetails(userCase)).toBe(true);
    });

    it('should return true if claimSummaryFile is an object with required properties', () => {
      const userCase = {
        typeOfClaim: ['discrimination'],
        claimSummaryFile: {
          document_binary_url: 'http://example.com/binary',
          document_filename: 'file.pdf',
          document_url: 'http://example.com/document',
        },
      };
      expect(validateClaimCheckDetails(userCase)).toBe(true);
    });

    it('should return true if claimSummaryFile is a non-empty string', () => {
      const userCase = { typeOfClaim: ['discrimination'], claimSummaryFile: 'file-url' };
      expect(validateClaimCheckDetails(userCase)).toBe(true);
    });

    it('should return false if claimSummaryFile and claimSummaryText are both missing', () => {
      const userCase = { typeOfClaim: ['discrimination'] };
      expect(validateClaimCheckDetails(userCase)).toBe(false);
    });
  });
});
