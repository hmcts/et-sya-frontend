import axios from 'axios';
import redis from 'redis-mock';

import TypeOfClaimController from '../../../main/controllers/TypeOfClaimController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { FEATURE_FLAGS, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { TypesOfClaim } from '../../../main/definitions/definition';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

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
  beforeEach(() => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_TYPE_PAY);
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

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_TYPE_DISCRIMINATION);
      expect(req.session.userCase).toStrictEqual({
        typeOfClaim: [TypesOfClaim.WHISTLE_BLOWING, TypesOfClaim.DISCRIMINATION],
      });
    });
  });

  it('should bypass date of last event when the ERA feature is disabled', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
    const res = mockResponse();

    await new TypeOfClaimController().post(
      mockRequestEmpty({ body: { typeOfClaim: [TypesOfClaim.UNFAIR_DISMISSAL] } }),
      res
    );

    expect(LaunchDarkly.getFlagValue).toHaveBeenCalledWith(FEATURE_FLAGS.ERA_OCTOBER_2026, null);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.DESCRIBE_WHAT_HAPPENED);
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
      await new TypeOfClaimController().post(mockRequest({ body: {}, userCase: { id: undefined } }), mockResponse());

      expect(caseApi.updateDraftCase).toHaveBeenCalledTimes(0);
    });
  });
});
