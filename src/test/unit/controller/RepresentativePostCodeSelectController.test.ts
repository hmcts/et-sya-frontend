import RepresentativePostCodeSelectController from '../../../main/controllers/RepresentativePostCodeSelectController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { AppRequest } from '../../../main/definitions/appRequest';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/address', () => ({
  getAddressesForPostcode: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../../main/controllers/helpers/CaseHelpers', () => ({
  ...jest.requireActual('../../../main/controllers/helpers/CaseHelpers'),
  checkCaseStateAndRedirect: jest.fn().mockReturnValue(false),
  handleUpdateDraftCase: jest.fn().mockResolvedValue({}),
}));

describe('RepresentativePostCodeSelectController', () => {
  let controller: RepresentativePostCodeSelectController;
  let req: AppRequest;

  beforeEach(() => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
    controller = new RepresentativePostCodeSelectController();
    req = mockRequest({ session: { userCase: {} } });
  });

  describe('post()', () => {
    it('should handle a POST request with a selected address', async () => {
      req.session.userCase.representativeEnterPostcode = 'SW1A 1AA';
      req.body = { representativeAddressTypes: '0' };

      await controller.post(req, mockResponse());

      expect(req.session.errors).toHaveLength(0);
    });
  });

  describe('get()', () => {
    it('should handle a GET request with no addresses found', async () => {
      req.session.userCase.representativeEnterPostcode = 'SW1A 2CC';

      await controller.get(req, mockResponse());

      expect(req.session.userCase.representativeAddresses).toEqual([]);
      expect(req.session.userCase.representativeAddressTypes).toHaveLength(1);
      expect(req.session.userCase.representativeAddressTypes[0].label).toBeDefined();
      expect(req.session.userCase.representativeAddressTypes[0].selected).toBe(true);
    });

    it('should render the representative postcode select page', async () => {
      req.session.userCase.representativeEnterPostcode = 'SW1A 1AA';
      const res = mockResponse();

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith('representative-postcode-select', expect.anything());
    });
  });
});
