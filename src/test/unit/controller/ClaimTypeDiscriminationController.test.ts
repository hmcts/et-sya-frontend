import ClaimTypeDiscriminationController from '../../../main/controllers/ClaimTypeDiscriminationController';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Claim Type Discrimination Controller', () => {
  const t = {
    'claim-type-discrimination': {},
    common: {},
  };

  beforeEach(() => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the claim type discrimination page', () => {
    const controller = new ClaimTypeDiscriminationController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIM_TYPE_DISCRIMINATION, expect.anything());
  });

  describe('Correct validation', () => {
    it('should require input', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();
      await new ClaimTypeDiscriminationController().post(req, res);

      const expectedErrors = [{ propertyName: 'claimTypeDiscrimination', errorType: 'required' }];

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(expectedErrors);
    });

    it('should assign userCase from the page form data', async () => {
      const req = mockRequest({
        body: {
          claimTypeDiscrimination: ['age', 'sex'],
        },
      });
      const res = mockResponse();

      await new ClaimTypeDiscriminationController().post(req, res);

      expect(req.session.userCase).toMatchObject({ claimTypeDiscrimination: ['age', 'sex'] });
    });

    it('should skip date of last event when the ERA feature is disabled', async () => {
      jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
      const res = mockResponse();

      await new ClaimTypeDiscriminationController().post(
        mockRequest({ body: { claimTypeDiscrimination: ['age'] } }),
        res
      );

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.DESCRIBE_WHAT_HAPPENED);
    });
  });
});
