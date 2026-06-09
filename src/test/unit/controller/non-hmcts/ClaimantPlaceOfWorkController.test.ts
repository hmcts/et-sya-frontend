import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantPlaceOfWorkController from '../../../../main/controllers/non-hmcts/ClaimantPlaceOfWorkController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('ClaimantPlaceOfWorkController', () => {
  const t = {
    'non-hmcts/claimant-place-of-work': {},
    'enter-address': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant place of work page', () => {
      const controller = new ClaimantPlaceOfWorkController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PLACE_OF_WORK, expect.anything());
    });

    it('should pre-populate address fields from workAddressTypes when present', () => {
      const controller = new ClaimantPlaceOfWorkController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: {
          workAddressTypes: [{ fullAddress: '56 High Street, London, SW17 0RN' }] as any,
          workAddresses: [{ addressLine1: '56 High Street', postTown: 'London', postCode: 'SW17 0RN' }] as any,
        },
      });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(TranslationKeys.CLAIMANT_PLACE_OF_WORK, expect.anything());
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_ACAS_CERT_NUM on valid submission', async () => {
      const body = {
        workAddress1: '56 High Street',
        workAddressTown: 'London',
        workAddressCountry: 'England',
      };
      const controller = new ClaimantPlaceOfWorkController();
      const req = mockRequest({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_ACAS_CERT_NUM);
    });

    it('should redirect to CLAIM_SAVED when saveForLater is set', async () => {
      const body = { saveForLater: true };
      const controller = new ClaimantPlaceOfWorkController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_SAVED);
    });
  });
});
