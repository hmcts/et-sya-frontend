import ClaimTypePayController from '../../../main/controllers/ClaimTypePayController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claim Type Pay Controller', () => {
  const t = {
    'claim-type-pay': {},
    common: {},
  };

  beforeEach(() => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the claim type pay page', () => {
    const controller = new ClaimTypePayController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_TYPE_PAY, expect.anything());
  });

  describe('Correct validation', () => {
    it('should require claimTypePay', async () => {
      const req = mockRequest({ body: {} });
      await new ClaimTypePayController().post(req, mockResponse());

      expect(req.session.errors).toEqual([{ propertyName: 'claimTypePay', errorType: 'required' }]);
    });

    it('should assign userCase from the page form data', async () => {
      const req = mockRequest({ body: { claimTypePay: ['holidayPay'] } });
      await new ClaimTypePayController().post(req, mockResponse());

      expect(req.session.userCase).toMatchObject({
        claimTypePay: ['holidayPay'],
      });
    });

    it('should skip date of last event when the ERA feature is disabled', async () => {
      jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
      const res = mockResponse();

      await new ClaimTypePayController().post(mockRequest({ body: { claimTypePay: ['holidayPay'] } }), res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.DESCRIBE_WHAT_HAPPENED);
    });
  });
});
