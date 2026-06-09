import * as helper from '../../../../main/controllers/helpers/CaseHelpers';
import RepresentedClaimantSelectPostcodeController from '../../../../main/controllers/non-hmcts/RepresentedClaimantSelectPostcodeController';
import { AppRequest } from '../../../../main/definitions/appRequest';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.mock('../../../../main/address', () => ({
  getAddressesForPostcode: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../../../main/controllers/helpers/CaseHelpers', () => ({
  ...jest.requireActual('../../../../main/controllers/helpers/CaseHelpers'),
  checkCaseStateAndRedirect: jest.fn().mockReturnValue(false),
  handleUpdateDraftCase: jest.fn().mockResolvedValue({}),
}));

describe('RepresentedClaimantSelectPostcodeController', () => {
  let selectPostController: RepresentedClaimantSelectPostcodeController;
  let req: AppRequest;

  beforeEach(() => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
    selectPostController = new RepresentedClaimantSelectPostcodeController();
    req = mockRequest({ session: { userCase: {} } });
  });

  describe('post()', () => {
    it('should handle a POST request with a selected address', async () => {
      req.session.userCase.representedClaimantEnterPostcode = 'LE5 5HD';
      req.body = { representedClaimantAddressTypes: '0' };

      await selectPostController.post(req, mockResponse());

      expect(req.session.errors).toHaveLength(0);
    });
  });

  describe('get()', () => {
    it('should handle a GET request with no addresses found', async () => {
      req.session.userCase.representedClaimantEnterPostcode = 'LE5 5HD';

      await selectPostController.get(req, mockResponse());

      expect(req.session.userCase.representedClaimantAddresses).toEqual([]);
      expect(req.session.userCase.representedClaimantAddressTypes).toHaveLength(1);
      expect(req.session.userCase.representedClaimantAddressTypes[0].label).toBeDefined();
      expect(req.session.userCase.representedClaimantAddressTypes[0].selected).toBe(true);
    });

    it('should render the representative postcode select page', async () => {
      req.session.userCase.representedClaimantEnterPostcode = 'LE5 5HD';
      const res = mockResponse();

      await selectPostController.get(req, res);

      expect(res.render).toHaveBeenCalledWith('non-hmcts/represented-claimant-select-postcode', expect.anything());
    });
  });
});
