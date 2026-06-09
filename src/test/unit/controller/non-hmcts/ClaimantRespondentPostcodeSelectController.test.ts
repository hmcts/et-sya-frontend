import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import ClaimantRespondentPostcodeSelectController from '../../../../main/controllers/non-hmcts/ClaimantRespondentPostcodeSelectController';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
jest.mock('../../../../main/address', () => ({
  getAddressesForPostcode: jest.fn().mockResolvedValue([]),
}));

describe('ClaimantRespondentPostcodeSelectController', () => {
  const t = {
    'non-hmcts/claimant-respondent-postcode-select': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the claimant respondent postcode select page', async () => {
      const controller = new ClaimantRespondentPostcodeSelectController();
      const response = mockResponse();
      const request = mockRequest({ t, userCase: { respondentEnterPostcode: 'SW1A 1AA' } });

      await controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_RESPONDENT_POSTCODE_SELECT,
        expect.objectContaining({ link: PageUrls.CLAIMANT_RESPONDENT_ADDRESS_DETAILS })
      );
    });
  });

  describe('post()', () => {
    it('should redirect to CLAIMANT_RESPONDENT_ADDRESS_DETAILS on selection', async () => {
      const body = { respondentAddressTypes: '0' };
      const controller = new ClaimantRespondentPostcodeSelectController();
      const req = mockRequestEmpty({ body });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_RESPONDENT_ADDRESS_DETAILS);
    });
  });
});
