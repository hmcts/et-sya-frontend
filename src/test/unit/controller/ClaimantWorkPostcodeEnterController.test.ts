import ClaimantWorkPostcodeEnterController from '../../../main/controllers/ClaimantWorkPostcodeEnterController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantWorkPostcodeEnterController', () => {
  const t = {
    'claimant-work-postcode-enter': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant work postcode enter page', () => {
      const controller = new ClaimantWorkPostcodeEnterController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_WORK_POSTCODE_ENTER, expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_WORK_POSTCODE_SELECT on valid postcode', async () => {
      const body = { workEnterPostcode: 'EC2R 8AJ' };
      const controller = new ClaimantWorkPostcodeEnterController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_WORK_POSTCODE_SELECT);
    });
  });
});
