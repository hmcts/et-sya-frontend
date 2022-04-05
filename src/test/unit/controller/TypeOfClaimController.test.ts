import express from 'express';
import redis from 'redis-mock';

import TypeOfClaimController from '../../../main/controllers/TypeOfClaimController';
import { AuthUrls, CacheMapNames, RedisErrors, TranslationKeys } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { cacheTypesOfClaim } from '../../../main/services/CacheService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const app = express();
const redisClient = redis.createClient();

jest.mock('../../../main/services/CacheService', () => {
  return {
    cacheTypesOfClaim: jest.fn(),
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
    const userCase = { typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT] };
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
      const body = { typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT] };

      const controller = new TypeOfClaimController();

      const req = mockRequest({ body });
      const res = mockResponse();
      req.session.userCase = undefined;

      controller.post(req, res);

      expect(res.redirect).toBeCalledWith(AuthUrls.LOGIN);
      expect(req.session.userCase).toStrictEqual({
        typeOfClaim: TypesOfClaim.BREACH_OF_CONTRACT,
      });
    });

    it('should cache the Types of Claims to Redis', () => {
      const body = { typeOfClaim: [TypesOfClaim.BREACH_OF_CONTRACT] };

      const controller = new TypeOfClaimController();

      const req = mockRequest({ body });
      const res = mockResponse();

      const cacheMap = new Map<string, string>([
        [CacheMapNames.CASE_TYPE, undefined],
        [CacheMapNames.TYPES_OF_CLAIM, JSON.stringify(TypesOfClaim.BREACH_OF_CONTRACT)],
      ]);

      req.app = app;
      req.app.locals = {
        redisClient,
      };

      controller.post(req, res);

      expect(cacheTypesOfClaim).toHaveBeenCalledWith(redisClient, cacheMap);
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
  });
});
