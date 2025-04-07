import e from 'express';

import { getAddressesForPostcode } from '../../../main/address';
import RespondentPostCodeSelectController from '../../../main/controllers/RespondentPostCodeSelectController';
import * as helper from '../../../main/controllers/helpers/CaseHelpers';
import { AppRequest } from '../../../main/definitions/appRequest';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('../../../main/address', () => ({
  getAddressesForPostcode: jest.fn(),
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
    req = mockRequest({
      session: { userCase: {} },
    });
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

    it('should redirect to manual address entry if no addresses found', async () => {
      req.session.userCase.respondentAddressTypes = [{ label: 'No addresses found', selected: true }];
      req.body = {
        addresses,
        addressTypes,
      };
      await controller.post(req, res());
      expect(req.session.errors).toHaveLength(0);
    });

    it('should redirect to address selection if addresses are found', async () => {
      req.session.userCase.respondentEnterPostcode = 'SW1A 1AA';
      req.session.userCase.respondentAddressTypes = [{ label: '1 address found', selected: true }];
      req.body = {
        addresses,
        addressTypes,
      };
      await controller.post(req, res());
      expect(req.session.errors).toHaveLength(0);
    });
  });

  describe('get', () => {
    it('should handle get request with multiple addresses', async () => {
      req.session.userCase.respondentEnterPostcode = 'SW1A 1AA';

      const mockAddresses = [
        {
          fullAddress: 'Buckingham Palace, London, SW1A 1AA',
          street1: 'Buckingham Palace',
          street2: '',
          town: 'London',
          county: 'City Of Westminster',
          postcode: 'SW1A 1AA',
          country: 'England',
        },
        {
          fullAddress: '10 Downing Street, London, SW1A 2AA',
          street1: '10 Downing Street',
          street2: '',
          town: 'London',
          county: 'City Of Westminster',
          postcode: 'SW1A 2AA',
          country: 'England',
        },
      ];

      (getAddressesForPostcode as jest.Mock).mockResolvedValue(mockAddresses);

      await controller.get(req, res());
      expect(req.session.userCase.respondentAddresses.length).toBeGreaterThan(0);
      expect(req.session.userCase.respondentAddressTypes.length).toBeGreaterThan(1);
      expect(req.session.userCase.respondentAddressTypes[0].label).toBe('Several addresses found');
      expect(req.session.userCase.respondentAddressTypes[1].label).toBe('Buckingham Palace, London, SW1A 1AA');
      expect(req.session.userCase.respondentAddressTypes[2].label).toBe('10 Downing Street, London, SW1A 2AA');
    });

    it('should handle get request with no addresses', async () => {
      req.session.userCase.respondentEnterPostcode = 'INVALID';

      const mockAddresses: never[] = [];
      (getAddressesForPostcode as jest.Mock).mockResolvedValue(mockAddresses);
      await controller.get(req, res());
      expect(req.session.userCase.respondentAddresses).toEqual([]);
      expect(req.session.userCase.respondentAddressTypes).toHaveLength(1);
      expect(req.session.userCase.respondentAddressTypes[0].label).toBe('No addresses found');
      expect(req.session.userCase.respondentAddressTypes[0].selected).toBe(true);
    });
  });
});
