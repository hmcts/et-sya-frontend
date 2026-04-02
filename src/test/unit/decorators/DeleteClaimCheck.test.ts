import { Response } from 'express';

import { DeleteClaimCheck, checkStateAndRedirect } from '../../../main/decorators/DeleteClaimCheck';
import { AppRequest } from '../../../main/definitions/appRequest';
import { CaseState } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('DeleteClaimCheck Decorator', () => {
  describe('checkStateAndRedirect function', () => {
    it('should return false when URL does not contain delete pattern', () => {
      const req = mockRequest({});
      req.url = '/some-other-page';
      const res = mockResponse();

      const result = checkStateAndRedirect(req, res);

      expect(result).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should redirect when case does not exist in userCases', () => {
      const req = mockRequest({});
      req.url = '/claimant-application/12345/delete';
      req.params.id = '12345';
      req.session.userCases = [
        {
          id: '99999',
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          typeOfClaim: ['test'],
          createdDate: 'August 19, 2022',
          lastModified: 'August 19, 2022',
        },
      ];
      const res = mockResponse();

      const result = checkStateAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith('/claimant-applications?lng=en');
    });

    it('should redirect when case ID is in deletedCaseIds list', () => {
      const req = mockRequest({});
      req.url = '/claimant-application/12345/delete';
      req.params.id = '12345';
      req.session.userCases = [
        {
          id: '12345',
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          typeOfClaim: ['test'],
          createdDate: 'August 19, 2022',
          lastModified: 'August 19, 2022',
        },
      ];
      req.session.deletedCaseIds = ['12345'];
      const res = mockResponse();

      const result = checkStateAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith('/claimant-applications?lng=en');
    });

    it('should handle language parameters during redirect', () => {
      const req = mockRequest({});
      req.url = '/claimant-application/12345/delete?lng=cy';
      req.params.id = '12345';
      req.session.userCases = [];
      const res = mockResponse();

      const result = checkStateAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith('/claimant-applications?lng=cy');
    });

    it('should return false and not redirect when case is valid and not deleted', () => {
      const req = mockRequest({});
      req.url = '/claimant-application/12345/delete';
      req.params.id = '12345';
      req.session.userCases = [
        {
          id: '12345',
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          typeOfClaim: ['test'],
          createdDate: 'August 19, 2022',
          lastModified: 'August 19, 2022',
        },
      ];
      req.session.deletedCaseIds = [];
      const res = mockResponse();

      const result = checkStateAndRedirect(req, res);

      expect(result).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });

  describe('DeleteClaimCheck decorator', () => {
    class TestController {
      @DeleteClaimCheck()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public testMethod(_req: AppRequest, _res: Response): string {
        return 'success';
      }
    }

    let controller: TestController;

    beforeEach(() => {
      controller = new TestController();
    });

    it('should prevent method execution on invalid state', () => {
      const req = mockRequest({});
      req.url = '/claimant-application/12345/delete';
      req.params.id = '12345';
      req.session.userCases = [];
      const res = mockResponse();

      const result = controller.testMethod(req, res);

      expect(result).toBeUndefined();
      expect(res.redirect).toHaveBeenCalled();
    });

    it('should allow method execution on valid state', () => {
      const req = mockRequest({});
      req.url = '/claimant-application/12345/delete';
      req.params.id = '12345';
      req.session.userCases = [
        {
          id: '12345',
          state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
          typeOfClaim: ['test'],
          createdDate: 'August 19, 2022',
          lastModified: 'August 19, 2022',
        },
      ];
      const res = mockResponse();

      const result = controller.testMethod(req, res);

      expect(result).toBe('success');
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });
});
