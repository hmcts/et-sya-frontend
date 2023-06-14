import axios from 'axios';
import express from 'express';
import redis from 'redis-mock';

import TypeOfClaimController from '../../../main/controllers/TypeOfClaimController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseDataCacheKey } from '../../../main/definitions/case';
import { LegacyUrls, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { cachePreloginCaseData } from '../../../main/services/CacheService';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const app = express();
const redisClient = redis.createClient();

jest.mock('../../../main/services/CacheService', () => {
  return {
    cachePreloginCaseData: jest.fn(),
  };
});
describe('Type Of Claim Controller', () => {
  afterAll(() => {
    redisClient.quit();
  });

  const t = {
    'type-of-claim': {},
    common: {},
  };

  it('should render the Type Of Claim controller page', () => {
    const typeOfController = new TypeOfClaimController();

    const response = mockResponse();
    const userCase = {
      typeOfClaim: [
        TypesOfClaim.BREACH_OF_CONTRACT,
        TypesOfClaim.DISCRIMINATION,
        TypesOfClaim.UNFAIR_DISMISSAL,
        TypesOfClaim.OTHER_TYPES,
        TypesOfClaim.PAY_RELATED_CLAIM,
      ],
    };
    const request = mockRequest({ t, userCase });

    typeOfController.get(request, response);

    expect(response.render).toHaveBeenCalledWith(TranslationKeys.TYPE_OF_CLAIM, expect.anything());
  });

  describe('post()', () => {
    it('should redirect back to Type of Claim page when errors are present', async () => {
      const errors = [{ propertyName: 'typeOfClaim', errorType: 'required' }];
      const body = { typeOfClaim: [''] };

      const controller = new TypeOfClaimController();

      const req = mockRequest({ body });
      const res = mockResponse();
      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign userCase from formData for Type of Claim', async () => {
      const body = {
        typeOfClaim: [
          TypesOfClaim.BREACH_OF_CONTRACT,
          TypesOfClaim.OTHER_TYPES,
          TypesOfClaim.PAY_RELATED_CLAIM,
          TypesOfClaim.UNFAIR_DISMISSAL,
        ],
        otherClaim: 'Help',
      };
      jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());

      const controller = new TypeOfClaimController();

      const req = mockRequestEmpty({ body });
      const res = mockResponse();
      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(LegacyUrls.ET1_BASE);
      expect(req.session.userCase).toStrictEqual({
        typeOfClaim: [
          TypesOfClaim.BREACH_OF_CONTRACT,
          TypesOfClaim.OTHER_TYPES,
          TypesOfClaim.PAY_RELATED_CLAIM,
          TypesOfClaim.UNFAIR_DISMISSAL,
        ],
        otherClaim: 'Help',
      });
    });

    it('should assign userCase from formData for Type of Claim and redirect call with step to making your claim', async () => {
      const body = {
        typeOfClaim: [TypesOfClaim.WHISTLE_BLOWING, TypesOfClaim.DISCRIMINATION],
      };
      jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());

      const controller = new TypeOfClaimController();

      const req = mockRequestEmpty({ body });
      const res = mockResponse();
      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
      expect(req.session.userCase).toStrictEqual({
        typeOfClaim: [TypesOfClaim.WHISTLE_BLOWING, TypesOfClaim.DISCRIMINATION],
      });
    });

    it('should cache the Other Types of Claims to Redis', async () => {
      const body = {
        typeOfClaim: [TypesOfClaim.OTHER_TYPES],
        otherClaim: 'No notice',
      };

      const controller = new TypeOfClaimController();

      const req = mockRequest({ body });
      const res = mockResponse();

      const cacheMap = new Map<CaseDataCacheKey, string>([
        [CaseDataCacheKey.POSTCODE, undefined],
        [CaseDataCacheKey.CLAIMANT_REPRESENTED, undefined],
        [CaseDataCacheKey.CASE_TYPE, undefined],
        [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.OTHER_TYPES])],
        [CaseDataCacheKey.OTHER_CLAIM_TYPE, 'No notice'],
        [CaseDataCacheKey.ACAS_MULTIPLE, undefined],
        [CaseDataCacheKey.VALID_NO_ACAS_REASON, undefined],
      ]);
      req.app = app;
      req.app.locals = {
        redisClient,
      };
      await controller.post(req, res);
      expect(cachePreloginCaseData).toHaveBeenCalledWith(redisClient, cacheMap);
    });

    it('should cache the Types of Claims to Redis', () => {
      const body = {
        typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT],
      };

      const controller = new TypeOfClaimController();

      const req = mockRequest({ body });
      const res = mockResponse();

      const cacheMap = new Map<CaseDataCacheKey, string>([
        [CaseDataCacheKey.POSTCODE, undefined],
        [CaseDataCacheKey.CLAIMANT_REPRESENTED, undefined],
        [CaseDataCacheKey.CASE_TYPE, undefined],
        [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.BREACH_OF_CONTRACT])],
        [CaseDataCacheKey.OTHER_CLAIM_TYPE, undefined],
        [CaseDataCacheKey.ACAS_MULTIPLE, undefined],
        [CaseDataCacheKey.VALID_NO_ACAS_REASON, undefined],
      ]);
      req.app = app;
      req.app.locals = {
        redisClient,
      };
      controller.post(req, res);
      expect(cachePreloginCaseData).toHaveBeenCalledWith(redisClient, cacheMap);
    });

    it('should redirect to ET1_BASE page if Breach of Contract is selected', async () => {
      const body = { typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT] };
      const controller = new TypeOfClaimController();
      const req = mockRequest({ body });
      const res = mockResponse();

      jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());

      jest.spyOn(res, 'redirect');

      await controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(LegacyUrls.ET1_BASE);
    });

    it('should redirect to LOGIN page if Discrimination is selected', async () => {
      const body = { typeOfClaim: [TypesOfClaim.DISCRIMINATION] };
      const controller = new TypeOfClaimController();
      const req = mockRequest({ body });
      const res = mockResponse();

      jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());

      jest.spyOn(res, 'redirect');

      await controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
    });
  });

  describe('Updating draft case', () => {
    jest.mock('axios');
    const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

    beforeEach(() => {
      caseApi.updateDraftCase = jest.fn().mockResolvedValue([]);
    });

    it('should update draft case when case exists', async () => {
      await new TypeOfClaimController().post(
        mockRequest({ body: { typeOfClaim: [TypesOfClaim.DISCRIMINATION] }, userCase: {} }),
        mockResponse()
      );

      expect(caseApi.updateDraftCase).toHaveBeenCalled();
    });

    it("should not update draft case when case hasn't been created yet", async () => {
      await new TypeOfClaimController().post(
        mockRequest({ body: { typeOfClaim: [TypesOfClaim.DISCRIMINATION] }, userCase: { id: undefined } }),
        mockResponse()
      );

      expect(caseApi.updateDraftCase).toHaveBeenCalledTimes(1);
    });
  });
});
