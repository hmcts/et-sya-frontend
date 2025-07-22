import { Response } from 'express';

import { CaseStateCheck, checkCaseStateAndRedirect } from '../../../main/decorators/CaseStateCheck';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls } from '../../../main/definitions/constants';
import { CaseState } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('CaseStateCheck Decorator', () => {
  describe('checkCaseStateAndRedirect function', () => {
    it('should redirect to CLAIMANT_APPLICATIONS when userCase has no id and state is not AWAITING_SUBMISSION_TO_HMCTS', () => {
      const req = mockRequest({
        userCase: { state: CaseState.DRAFT },
      });
      // Remove the default id from mockRequest
      req.session.userCase.id = undefined;
      req.url = '/some-path';
      const res = mockResponse();

      const result = checkCaseStateAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });

    it('should redirect to citizen hub when userCase has id and state is not AWAITING_SUBMISSION_TO_HMCTS', () => {
      const req = mockRequest({
        userCase: { id: '12345', state: CaseState.SUBMITTED },
      });
      req.url = '/some-path';
      const res = mockResponse();

      const result = checkCaseStateAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12345?lng=en');
    });

    it('should redirect to citizen hub with language param when userCase has id and state is not AWAITING_SUBMISSION_TO_HMCTS', () => {
      const req = mockRequest({
        userCase: { id: '12345', state: CaseState.ACCEPTED },
      });
      req.url = '/some-path?lng=cy';
      const res = mockResponse();

      const result = checkCaseStateAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12345?lng=cy');
    });

    it('should not redirect when case state is AWAITING_SUBMISSION_TO_HMCTS', () => {
      const req = mockRequest({
        userCase: { id: '12345', state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
      });
      const res = mockResponse();

      const result = checkCaseStateAndRedirect(req, res);

      expect(result).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should redirect to CLAIMANT_APPLICATIONS when userCase is undefined', () => {
      const req = mockRequest({});
      req.session.userCase = undefined;
      const res = mockResponse();

      const result = checkCaseStateAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });

    it('should redirect to CLAIMANT_APPLICATIONS when session is undefined', () => {
      const req = {} as AppRequest;
      req.session = undefined;
      const res = mockResponse();

      const result = checkCaseStateAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });
  });

  describe('CaseStateCheck decorator', () => {
    class TestController {
      @CaseStateCheck()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public testMethod(_req: AppRequest, _res: Response): string {
        return 'method executed';
      }

      @CaseStateCheck()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public async testAsyncMethod(_req: AppRequest, _res: Response): Promise<string> {
        return 'async method executed';
      }
    }

    let controller: TestController;

    beforeEach(() => {
      controller = new TestController();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should execute the original method when case state is AWAITING_SUBMISSION_TO_HMCTS', () => {
      const req = mockRequest({
        userCase: { id: '12345', state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
      });
      const res = mockResponse();

      const result = controller.testMethod(req, res);

      expect(result).toBe('method executed');
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should not execute the original method when redirect occurs', () => {
      const req = mockRequest({
        userCase: { state: CaseState.DRAFT },
      });
      // Remove the default id from mockRequest to ensure redirect to CLAIMANT_APPLICATIONS
      req.session.userCase.id = undefined;
      req.url = '/some-path';
      const res = mockResponse();

      const result = controller.testMethod(req, res);

      expect(result).toBeUndefined();
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });

    it('should handle async methods correctly when case state is AWAITING_SUBMISSION_TO_HMCTS', async () => {
      const req = mockRequest({
        userCase: { id: '12345', state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
      });
      const res = mockResponse();

      const result = await controller.testAsyncMethod(req, res);

      expect(result).toBe('async method executed');
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should handle async methods correctly when redirect occurs', async () => {
      const req = mockRequest({
        userCase: { state: CaseState.SUBMITTED },
      });
      // Remove the default id from mockRequest to ensure redirect to CLAIMANT_APPLICATIONS
      req.session.userCase.id = undefined;
      req.url = '/some-path';
      const res = mockResponse();

      const result = await controller.testAsyncMethod(req, res);

      expect(result).toBeUndefined();
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });

    it('should preserve method context (this binding)', () => {
      const req = mockRequest({
        userCase: { id: '12345', state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
      });
      const res = mockResponse();

      // Add a property to the controller to test context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (controller as any).testProperty = 'test value';

      // Modify the test method to use 'this'
      controller.testMethod = function (): string {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return `method executed with ${(this as any).testProperty}`;
      };

      // Apply decorator manually for this test
      const decoratedMethod = CaseStateCheck()(controller, 'testMethod', {
        value: controller.testMethod,
        writable: true,
        enumerable: true,
        configurable: true,
      }).value;

      const result = decoratedMethod.call(controller, req, res);

      expect(result).toBe('method executed with test value');
    });

    it('should pass additional arguments to the original method', () => {
      const req = mockRequest({
        userCase: { id: '12345', state: CaseState.AWAITING_SUBMISSION_TO_HMCTS },
      });
      const res = mockResponse();
      const additionalArg = 'extra argument';

      // Create a method that accepts additional arguments
      const methodWithArgs = jest.fn((requestArg: AppRequest, responseArg: Response, extra: string) => {
        return `method executed with ${extra}`;
      });

      // Apply decorator
      const decoratedMethod = CaseStateCheck()(controller, 'testMethod', {
        value: methodWithArgs,
        writable: true,
        enumerable: true,
        configurable: true,
      }).value;

      const result = decoratedMethod.call(controller, req, res, additionalArg);

      expect(result).toBe('method executed with extra argument');
      expect(methodWithArgs).toHaveBeenCalledWith(req, res, additionalArg);
    });
  });

  describe('Edge cases', () => {
    it('should handle case when userCase state is undefined', () => {
      const req = mockRequest({
        userCase: { id: '12345' }, // state is undefined
      });
      req.url = '/some-path';
      const res = mockResponse();

      const result = checkCaseStateAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12345?lng=en');
    });

    it('should handle case when userCase id is empty string', () => {
      const req = mockRequest({
        userCase: { id: '', state: CaseState.DRAFT },
      });
      const res = mockResponse();

      const result = checkCaseStateAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });

    it('should handle case when userCase id is null', () => {
      const req = mockRequest({
        userCase: { id: null, state: CaseState.DRAFT },
      });
      const res = mockResponse();

      const result = checkCaseStateAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });
  });
});
