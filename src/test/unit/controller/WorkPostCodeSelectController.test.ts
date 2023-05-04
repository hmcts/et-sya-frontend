import e from 'express';

import WorkPostCodeSelectController from '../../../main/controllers/WorkPostCodeSelectController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { AppRequest } from '../../../main/definitions/appRequest';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
describe('WorkPostCodeSelectController', () => {
  let controller: WorkPostCodeSelectController;
  let req: AppRequest;
  let res: () => e.Response;
  let addresses = {};
  let addressTypes = {};

  beforeEach(() => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
    controller = new WorkPostCodeSelectController();
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
      req.session.userCase.workEnterPostcode = 'SW1A 1AA';
      req.body = {
        addresses,
        addressTypes,
      };
      await controller.post(req, mockResponse());
      expect(req.session.errors).toHaveLength(0);
    });
  });

  describe('get', () => {
    it('should handle get request with multiple addresses', async () => {
      req.session.userCase.workEnterPostcode = 'SW1A 1AA';
      await controller.get(req, mockResponse());
      expect(req.session.userCase.workAddresses).toStrictEqual(addresses);
      expect(req.session.userCase.workAddressTypes.length).toBeGreaterThan(0);
      expect(req.session.userCase.workAddressTypes[0].label).toEqual('Several addresses found');
      expect(req.session.userCase.workAddressTypes[0].selected).toBe(true);
      expect(req.session.userCase.workAddressTypes[1].value).toBeDefined();
      expect(req.session.userCase.workAddressTypes[1].label).toBeDefined();
    });

    it('should handle get request with no addresses', async () => {
      req.session.userCase.workEnterPostcode = 'SW1A 2CC';
      await controller.get(req, res());
      expect(req.session.userCase.workAddresses).toEqual([]);
      expect(req.session.userCase.workAddressTypes.length).toBeGreaterThan(0);
      expect(req.session.userCase.workAddressTypes[0].label).toBeDefined();
      expect(req.session.userCase.workAddressTypes[0].selected).toBe(true);
    });
  });
});
