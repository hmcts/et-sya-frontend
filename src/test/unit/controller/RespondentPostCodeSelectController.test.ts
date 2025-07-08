import e from 'express';

import RespondentPostCodeSelectController from '../../../main/controllers/RespondentPostCodeSelectController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { AppRequest } from '../../../main/definitions/appRequest';
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

describe('RespondentPostCodeSelectController', () => {
  let controller: RespondentPostCodeSelectController;
  let req: AppRequest;
  let res: () => e.Response;
  let addresses = {};
  let addressTypes = {};

  beforeEach(() => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
    controller = new RespondentPostCodeSelectController();
    req = mockRequest({ session: { userCase: {} } });
    res = mockResponse;
    addresses = [
      {
        fullAddress: 'Buckingham Palace, London, SW1A 1AA',
        street1: 'Buckingham Palace',
        street2: '',
        town: 'London',
        county: 'City Of Westminster',
        postcode: 'SW1A 1AA',
        country: 'England',
      },
    ];
    addressTypes = [
      {
        label: '1 address found',
        value: '0',
        selected: 'true',
      },
      {
        label: 'Buckingham Palace, London, SW1A 1AA',
        value: '1',
        selected: 'false',
      },
    ];
  });

  describe('post', () => {
    it('should handle post request', async () => {
      req.session.userCase.respondentEnterPostcode = 'SW1A 1AA';
      req.body = {
        addresses,
        addressTypes,
      };
      await controller.post(req, mockResponse());
      expect(req.session.errors).toHaveLength(0);
    });
  });

  describe('get', () => {
    it('should handle get request with no addresses', async () => {
      req.session.userCase.respondentEnterPostcode = 'SW1A 2CC';
      await controller.get(req, res());
      expect(req.session.userCase.respondentAddresses).toEqual([]);
      expect(req.session.userCase.respondentAddressTypes.length).toBeGreaterThan(0);
      expect(req.session.userCase.respondentAddressTypes[0].label).toBeDefined();
      expect(req.session.userCase.respondentAddressTypes[0].selected).toBe(true);
    });
  });
});
