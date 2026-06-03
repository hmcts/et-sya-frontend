import * as groupClaimsValidator from '../../../../main/components/form/group-claims-validator';
import * as CaseHelper from '../../../../main/controllers/helpers/CaseHelpers';
import GroupClaimsCheckController from '../../../../main/controllers/multiples/GroupClaimsCheckController';
import { CaseType, YesOrNo } from '../../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../../main/definitions/constants';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handlePostLogic').mockImplementation(() => Promise.resolve());

describe('GroupClaimsCheckController', () => {
  const t = {
    groupClaimsCheck: {},
    common: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should render the group claims check page', () => {
      const controller = new GroupClaimsCheckController();
      const req = mockRequest({ t });
      const res = mockResponse();

      controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(TranslationKeys.GROUP_CLAIMS_CHECK, expect.anything());
    });
  });

  describe('post', () => {
    it('should call handlePostLogic when groupClaimsCheck is not Yes', async () => {
      const controller = new GroupClaimsCheckController();
      const req = mockRequest({ body: { groupClaimsCheck: 'No' } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.groupClaimsCheck).toBe('No');
      expect(CaseHelper.handlePostLogic).toHaveBeenCalledWith(
        req,
        res,
        expect.anything(),
        expect.anything(),
        PageUrls.CLAIM_STEPS
      );
    });

    it('should call handlePostLogic when groupClaimsCheck is Yes and validation passes', async () => {
      const controller = new GroupClaimsCheckController();
      const req = mockRequest({ body: { groupClaimsCheck: 'Yes' } });
      const res = mockResponse();
      req.session.errors = [];
      req.session.userCase.caseType = CaseType.MULTIPLE;
      req.session.userCase.leadClaimant = YesOrNo.YES;
      req.session.userCase.additionalClaimants = [
        {
          firstName: 'Jane',
          lastName: 'Doe',
          address: { AddressLine1: '1 Main St', PostTown: 'London', Country: 'England' },
        },
      ];

      jest.spyOn(groupClaimsValidator, 'validateGroupClaimsCheckDetails').mockReturnValue(true);

      await controller.post(req, res);

      expect(CaseHelper.handlePostLogic).toHaveBeenCalledWith(
        req,
        res,
        expect.anything(),
        expect.anything(),
        PageUrls.CLAIM_STEPS
      );
    });

    it('should render with errors when groupClaimsCheck is Yes and validation fails', async () => {
      const controller = new GroupClaimsCheckController();
      const req = mockRequest({ body: { groupClaimsCheck: 'Yes' } });
      const res = mockResponse();
      req.session.errors = [];
      req.session.userCase.caseType = CaseType.MULTIPLE;
      req.session.userCase.additionalClaimants = [];

      jest.spyOn(groupClaimsValidator, 'validateGroupClaimsCheckDetails').mockReturnValue(false);

      await controller.post(req, res);

      expect(req.session.errors).toEqual(
        expect.arrayContaining([expect.objectContaining({ propertyName: 'groupClaimsCheck', errorType: 'invalid' })])
      );
      expect(res.render).toHaveBeenCalledWith(TranslationKeys.GROUP_CLAIMS_CHECK, expect.anything());
      expect(CaseHelper.handlePostLogic).not.toHaveBeenCalled();
    });

    it('should set groupClaimsCheck on session from body', async () => {
      const controller = new GroupClaimsCheckController();
      const req = mockRequest({ body: { groupClaimsCheck: 'No' } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(req.session.userCase.groupClaimsCheck).toBe('No');
    });
  });
});
