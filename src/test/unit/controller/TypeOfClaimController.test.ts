// import { handleSessionErrors } from '../../../main/controllers/helpers';
import express from 'express';
import redis from 'redis-mock';

import TypeOfClaimController from '../../../main/controllers/TypeOfClaimController';
import { CaseDataCacheKey } from '../../../main/definitions/case';
import { LegacyUrls, PageUrls, RedisErrors, TranslationKeys } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { cachePreloginCaseData } from '../../../main/services/CacheService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const app = express();
const redisClient = redis.createClient();

jest.mock('../../../main/services/CacheService', () => {
  return {
    cachePreloginCaseData: jest.fn(),
  };
});
describe('Type Of Claim Controller', () => {
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
    it('should redirect back to Type of Claim page when errors are present', () => {
      const errors = [{ propertyName: 'typeOfClaim', errorType: 'required' }];
      const body = { typesOfClaim: [''] };

      const controller = new TypeOfClaimController();

      const req = mockRequest({ body });
      const res = mockResponse();
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(req.path);
      expect(req.session.errors).toEqual(errors);
    });

    it('should assign userCase from formData for Type of Claim', () => {
      const body = {
        typeOfClaim: [
          TypesOfClaim.BREACH_OF_CONTRACT,
          TypesOfClaim.DISCRIMINATION,
          TypesOfClaim.OTHER_TYPES,
          TypesOfClaim.PAY_RELATED_CLAIM,
        ],
      };

      const controller = new TypeOfClaimController();

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;
      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(LegacyUrls.ET1_BASE);
      expect(req.session.userCase).toStrictEqual({
        typeOfClaim: [
          TypesOfClaim.BREACH_OF_CONTRACT,
          TypesOfClaim.DISCRIMINATION,
          TypesOfClaim.OTHER_TYPES,
          TypesOfClaim.PAY_RELATED_CLAIM,
        ],
      });
    });

    it('should cache the Other Types of Claims to Redis', () => {
      const body = {
        typeOfClaim: [TypesOfClaim.OTHER_TYPES],
      };

      const controller = new TypeOfClaimController();

      const req = mockRequest({ body });
      const res = mockResponse();

      const cacheMap = new Map<CaseDataCacheKey, string>([
        [CaseDataCacheKey.CLAIMANT_REPRESENTED, undefined],
        [CaseDataCacheKey.CASE_TYPE, undefined],
        [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.OTHER_TYPES])],
      ]);
      req.app = app;
      req.app.locals = {
        redisClient,
      };
      controller.post(req, res);
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
        [CaseDataCacheKey.CLAIMANT_REPRESENTED, undefined],
        [CaseDataCacheKey.CASE_TYPE, undefined],
        [CaseDataCacheKey.TYPES_OF_CLAIM, JSON.stringify([TypesOfClaim.BREACH_OF_CONTRACT])],
      ]);
      req.app = app;
      req.app.locals = {
        redisClient,
      };
      controller.post(req, res);
      expect(cachePreloginCaseData).toHaveBeenCalledWith(redisClient, cacheMap);
    });

    it('should throw error if Redis client not found', () => {
      const body = { typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT] };

      const controller = new TypeOfClaimController();

      const req = mockRequest({ body });
      const res = mockResponse();

      req.app = app;
      req.app.locals = {};

      expect(() => {
        controller.post(req, res);
      }).toThrowError(RedisErrors.CLIENT_NOT_FOUND);
    });

    it('should redirect to ET1_BASE page if Breach of Contract is selected', () => {
      const body = { typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT] };
      const controller = new TypeOfClaimController();
      const req = mockRequest({ body });
      const res = mockResponse();

      jest.spyOn(res, 'redirect');

      controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(LegacyUrls.ET1_BASE);
    });

    it('should redirect to LOGIN page if Discrimination is selected', () => {
      const body = { typeOfClaim: [TypesOfClaim.DISCRIMINATION] };
      const controller = new TypeOfClaimController();
      const req = mockRequest({ body });
      const res = mockResponse();

      jest.spyOn(res, 'redirect');

      controller.post(req, res);
      expect(res.redirect).toHaveBeenCalledWith(LegacyUrls.ET1_BASE);
    });
  });

  it('should redirect to LOGIN page if unfair dismissal is selected', () => {
    const body = { typeOfClaim: [TypesOfClaim.UNFAIR_DISMISSAL] };
    const controller = new TypeOfClaimController();
    const req = mockRequest({ body });
    const res = mockResponse();

    jest.spyOn(res, 'redirect');

    controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
  });
});
