import WorkPostCodeSelectController from '../../../main/controllers/WorkPostCodeSelectController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

// Mock the address module
jest.mock('../../../main/address', () => ({
  getAddressesForPostcode: jest.fn().mockResolvedValue([]),
}));

// Mock the case helpers
jest.mock('../../../main/controllers/helpers/CaseHelpers', () => ({
  ...jest.requireActual('../../../main/controllers/helpers/CaseHelpers'),
  handleUpdateDraftCase: jest.fn().mockResolvedValue({}),
}));
jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('WorkPostCodeSelectController', () => {
  const controller = new WorkPostCodeSelectController();
  const addresses = [
    {
      fullAddress: 'FLAT 1, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
      street1: 'Flat 1, HOPE Court',
      street2: 'Prince Of Wales Road',
      town: 'Exeter',
      postcode: 'EX4 4PN',
      country: 'England',
    },
  ];
  const addressTypes = [
    {
      label: 'Several addresses found',
      value: '0',
      selected: 'true',
    },
    {
      label: 'FLAT 1, HOPE COURT, PRINCE OF WALES ROAD, EXETER, EX4 4PN',
      value: '1',
      selected: 'false',
    },
  ];

  describe('post', () => {
    it('should handle post request', async () => {
      const req = mockRequest({ session: { userCase: {} } });
      req.session.userCase.workEnterPostcode = 'EX4 4PN';
      req.body = {
        addresses,
        addressTypes,
      };
      await controller.post(req, mockResponse());
      expect(req.session.errors).toHaveLength(0);
    });

    it('should render the Work Enter Postcode page when returnUrl is CHECK_ANSWERS', async () => {
      const req = mockRequest({ session: { userCase: {} } });
      const res = mockResponse();
      req.session.userCase.workEnterPostcode = 'EX4 4PN';
      req.body = {
        addresses,
        addressTypes,
      };
      req.session.returnUrl = PageUrls.CHECK_ANSWERS;
      await controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith('/respondent/1/place-of-work');
    });
  });

  describe('get', () => {
    it('should handle get request with no addresses', async () => {
      const req = mockRequest({ session: { userCase: {} } });
      const res = mockResponse();
      req.session.userCase.workEnterPostcode = 'SW1A 2CC';
      await controller.get(req, res);
      expect(req.session.userCase.workAddresses).toEqual([]);
      expect(req.session.userCase.workAddressTypes.length).toBeGreaterThan(0);
      expect(req.session.userCase.workAddressTypes[0].label).toBeDefined();
      expect(req.session.userCase.workAddressTypes[0].selected).toBe(true);
    });
  });
});
