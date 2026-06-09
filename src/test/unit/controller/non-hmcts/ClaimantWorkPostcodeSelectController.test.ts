import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantWorkPostcodeSelectController from '../../../../main/controllers/non-hmcts/ClaimantWorkPostcodeSelectController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
jest.mock('../../../../main/address', () => ({
  getAddressesForPostcode: jest.fn().mockResolvedValue([]),
}));

describe('ClaimantWorkPostcodeSelectController', () => {
  const t = {
    'claimant-work-postcode-select': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant work postcode select page', async () => {
      const controller = new ClaimantWorkPostcodeSelectController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { workEnterPostcode: 'EC2R 8AJ' } });

      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_WORK_POSTCODE_SELECT,
        expect.objectContaining({ link: PageUrls.CLAIMANT_PLACE_OF_WORK })
      );
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_PLACE_OF_WORK on address selection', async () => {
      const body = { workAddressTypes: '0' };
      const controller = new ClaimantWorkPostcodeSelectController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_PLACE_OF_WORK);
    });
  });
});
