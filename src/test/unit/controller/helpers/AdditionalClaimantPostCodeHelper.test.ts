import {
  getAdditionalClaimantAddressLink,
  getAdditionalClaimantAddressTypes,
  getAddressPageHeader,
  getEnterTitle,
  getSelectTitle,
} from '../../../../main/controllers/helpers/AdditionalClaimantPostCodeHelper';
import { PageUrls, languages } from '../../../../main/definitions/constants';
import localesCy from '../../../../main/resources/locales/cy/translation/common.json';
import locales from '../../../../main/resources/locales/en/translation/common.json';
import { mockRequest } from '../../mocks/mockRequest';

describe('AdditionalClaimantPostCodeHelper', () => {
  describe('getAdditionalClaimantAddressTypes', () => {
    it('should return single address option label when response has exactly 1 address', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-select';
      const response = [{ fullAddress: '1 Main Street, London, SW1A 1AA' }];

      const result = getAdditionalClaimantAddressTypes(response, req);

      expect(result).toHaveLength(2);
      expect(result[0].selected).toBe(true);
      expect(result[0].label).toBe(locales.selectDefaultSingle);
      expect(result[1].label).toBe('1 Main Street, London, SW1A 1AA');
      expect(result[1].value).toBe(0);
    });

    it('should return several address option label when response has multiple addresses', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-select';
      const response = [
        { fullAddress: '1 Main Street, London, SW1A 1AA' },
        { fullAddress: '2 Main Street, London, SW1A 1AB' },
      ];

      const result = getAdditionalClaimantAddressTypes(response, req);

      expect(result).toHaveLength(3);
      expect(result[0].selected).toBe(true);
      expect(result[0].label).toBe(locales.selectDefaultSeveral);
    });

    it('should return no address option label when response is empty', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-select';

      const result = getAdditionalClaimantAddressTypes([], req);

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe(locales.selectDefaultNone);
    });

    it('should use Welsh locale labels when URL contains Welsh postfix', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-select?lng=cy';

      const result = getAdditionalClaimantAddressTypes([], req);

      expect(result[0].label).toBe(localesCy.selectDefaultNone);
    });

    it('should use Welsh single label for single response with Welsh URL', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-select?lng=cy';
      const response = [{ fullAddress: '1 Main Street' }];

      const result = getAdditionalClaimantAddressTypes(response, req);

      expect(result[0].label).toBe(localesCy.selectDefaultSingle);
    });

    it('should use Welsh several label for multiple responses with Welsh URL', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-select?lng=cy';
      const response = [{ fullAddress: '1 Main Street' }, { fullAddress: '2 Main Street' }];

      const result = getAdditionalClaimantAddressTypes(response, req);

      expect(result[0].label).toBe(localesCy.selectDefaultSeveral);
    });

    it('should handle null response gracefully', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-select';

      const result = getAdditionalClaimantAddressTypes(null, req);

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe(locales.selectDefaultNone);
    });
  });

  describe('getAdditionalClaimantAddressLink', () => {
    it('should return English URL parameter for English URL', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-enter';

      const result = getAdditionalClaimantAddressLink(req);

      expect(result).toBe(PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_SELECT + languages.ENGLISH_URL_PARAMETER);
    });

    it('should return Welsh URL parameter for Welsh URL', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-enter?lng=cy';

      const result = getAdditionalClaimantAddressLink(req);

      expect(result).toBe(PageUrls.ADDITIONAL_CLAIMANT_POSTCODE_SELECT + languages.WELSH_URL_PARAMETER);
    });
  });

  describe('getEnterTitle', () => {
    it('should return English title for English URL', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-enter';

      expect(getEnterTitle(req)).toBe(locales.additionalClaimantPostcodeEnterTitle);
    });

    it('should return Welsh title for Welsh URL', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-enter?lng=cy';

      expect(getEnterTitle(req)).toBe(localesCy.additionalClaimantPostcodeEnterTitle);
    });
  });

  describe('getSelectTitle', () => {
    it('should return English title for English URL', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-select';

      expect(getSelectTitle(req)).toBe(locales.additionalClaimantPostcodeSelectTitle);
    });

    it('should return Welsh title for Welsh URL', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-postcode-select?lng=cy';

      expect(getSelectTitle(req)).toBe(localesCy.additionalClaimantPostcodeSelectTitle);
    });
  });

  describe('getAddressPageHeader', () => {
    it('should return English header for English URL', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-address-details';

      expect(getAddressPageHeader(req)).toBe(locales.additionalClaimantAddressPageHeader);
    });

    it('should return Welsh header for Welsh URL', () => {
      const req = mockRequest({});
      req.url = '/additional-claimant-address-details?lng=cy';

      expect(getAddressPageHeader(req)).toBe(localesCy.additionalClaimantAddressPageHeader);
    });
  });
});
