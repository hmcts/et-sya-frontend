import { Response } from 'express';

import { FormSubmissionCheck, checkFormSubmissionAndRedirect } from '../../../main/decorators/FormSubmissionCheck';
import { AppRequest } from '../../../main/definitions/appRequest';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('FormSubmissionCheck Decorator', () => {
  describe('checkFormSubmissionAndRedirect function', () => {
    describe('Direct URL access prevention', () => {
      it('should redirect to citizen hub when visitedContactTribunalSelection flag is false', () => {
        const req = mockRequest({
          userCase: { id: '12345' },
        });
        req.session.visitedContactTribunalSelection = false;
        req.url = '/contact-the-tribunal/withdraw';
        req.get = jest.fn();
        const res = mockResponse();

        const result = checkFormSubmissionAndRedirect(req, res);

        expect(result).toBe(true);
        expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12345?lng=en');
      });

      it('should redirect to citizen hub when visitedContactTribunalSelection flag is undefined', () => {
        const req = mockRequest({
          userCase: { id: '12345' },
        });
        req.session.visitedContactTribunalSelection = undefined;
        req.url = '/contact-the-tribunal/withdraw';
        req.get = jest.fn();
        const res = mockResponse();

        const result = checkFormSubmissionAndRedirect(req, res);

        expect(result).toBe(true);
        expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12345?lng=en');
      });

      it('should redirect with Welsh language parameter when URL contains lng=cy', () => {
        const req = mockRequest({
          userCase: { id: '12345' },
        });
        req.session.visitedContactTribunalSelection = false;
        req.url = '/contact-the-tribunal/withdraw?lng=cy';
        req.get = jest.fn();
        const res = mockResponse();

        const result = checkFormSubmissionAndRedirect(req, res);

        expect(result).toBe(true);
        expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12345?lng=cy');
      });

      it('should allow access when visitedContactTribunalSelection flag is true', () => {
        const req = mockRequest({
          userCase: { id: '12345' },
        });
        req.session.visitedContactTribunalSelection = true;
        req.url = '/contact-the-tribunal/withdraw';
        req.get = jest.fn();
        const res = mockResponse();

        const result = checkFormSubmissionAndRedirect(req, res);

        expect(result).toBe(false);
        expect(res.redirect).not.toHaveBeenCalled();
      });
    });

    describe('Back button from completion pages prevention', () => {
      it('should redirect when coming from /application-complete', () => {
        const req = mockRequest({
          userCase: { id: '12345' },
        });
        req.session.visitedContactTribunalSelection = true;
        req.headers = { referer: 'https://localhost:3002/application-complete' };
        req.url = '/contact-the-tribunal/withdraw';
        req.get = jest.fn().mockReturnValue('https://localhost:3002/application-complete');
        const res = mockResponse();

        const result = checkFormSubmissionAndRedirect(req, res);

        expect(result).toBe(true);
        expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12345?lng=en');
      });

      it('should allow access when coming from non-completion page', () => {
        const req = mockRequest({
          userCase: { id: '12345' },
        });
        req.session.visitedContactTribunalSelection = true;
        req.headers = { referer: 'https://localhost:3002/contact-the-tribunal' };
        req.url = '/contact-the-tribunal/withdraw';
        req.get = jest.fn().mockReturnValue('https://localhost:3002/contact-the-tribunal');
        const res = mockResponse();

        const result = checkFormSubmissionAndRedirect(req, res);

        expect(result).toBe(false);
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it('should allow access when referer is undefined', () => {
        const req = mockRequest({
          userCase: { id: '12345' },
        });
        req.session.visitedContactTribunalSelection = true;
        req.headers = {};
        req.url = '/contact-the-tribunal/withdraw';
        req.get = jest.fn().mockReturnValue(undefined);
        const res = mockResponse();

        const result = checkFormSubmissionAndRedirect(req, res);

        expect(result).toBe(false);
        expect(res.redirect).not.toHaveBeenCalled();
      });
    });

    describe('Edge cases', () => {
      it('should not redirect when userCase id is undefined', () => {
        const req = mockRequest({
          userCase: {},
        });
        req.session.userCase.id = undefined;
        req.session.visitedContactTribunalSelection = false;
        req.url = '/contact-the-tribunal/withdraw';
        req.get = jest.fn();
        const res = mockResponse();

        const result = checkFormSubmissionAndRedirect(req, res);

        expect(result).toBe(false);
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it('should not redirect when userCase is undefined', () => {
        const req = mockRequest({});
        req.session.userCase = undefined;
        req.session.visitedContactTribunalSelection = false;
        req.url = '/contact-the-tribunal/withdraw';
        req.get = jest.fn();
        const res = mockResponse();

        const result = checkFormSubmissionAndRedirect(req, res);

        expect(result).toBe(false);
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it('should not redirect when session is undefined', () => {
        const req = {} as AppRequest;
        req.session = undefined;
        req.get = jest.fn();
        const res = mockResponse();

        const result = checkFormSubmissionAndRedirect(req, res);

        expect(result).toBe(false);
        expect(res.redirect).not.toHaveBeenCalled();
      });

      it('should handle Referrer header as well as Referer', () => {
        const req = mockRequest({
          userCase: { id: '12345' },
        });
        req.session.visitedContactTribunalSelection = true;
        req.headers = { referrer: 'https://localhost:3002/application-complete' };
        req.url = '/contact-the-tribunal/withdraw';
        req.get = jest.fn().mockReturnValue('https://localhost:3002/application-complete');
        const res = mockResponse();

        const result = checkFormSubmissionAndRedirect(req, res);

        expect(result).toBe(true);
        expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12345?lng=en');
      });
    });
  });

  describe('FormSubmissionCheck decorator', () => {
    class TestController {
      @FormSubmissionCheck()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public testMethod(_req: AppRequest, _res: Response): string {
        return 'method executed';
      }

      @FormSubmissionCheck()
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

    it('should execute the original method when form access is valid', () => {
      const req = mockRequest({
        userCase: { id: '12345' },
      });
      req.session.visitedContactTribunalSelection = true;
      req.url = '/contact-the-tribunal/withdraw';
      req.get = jest.fn();
      const res = mockResponse();

      const result = controller.testMethod(req, res);

      expect(result).toBe('method executed');
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should not execute the original method when redirect occurs due to missing flag', () => {
      const req = mockRequest({
        userCase: { id: '12345' },
      });
      req.session.visitedContactTribunalSelection = false;
      req.url = '/contact-the-tribunal/withdraw';
      req.get = jest.fn();
      const res = mockResponse();

      const result = controller.testMethod(req, res);

      expect(result).toBeUndefined();
      expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12345?lng=en');
    });

    it('should not execute the original method when redirect occurs due to completion page referer', () => {
      const req = mockRequest({
        userCase: { id: '12345' },
      });
      req.session.visitedContactTribunalSelection = true;
      req.headers = { referer: 'https://localhost:3002/application-complete' };
      req.url = '/contact-the-tribunal/withdraw';
      req.get = jest.fn().mockReturnValue('https://localhost:3002/application-complete');
      const res = mockResponse();

      const result = controller.testMethod(req, res);

      expect(result).toBeUndefined();
      expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12345?lng=en');
    });

    it('should handle async methods correctly when form access is valid', async () => {
      const req = mockRequest({
        userCase: { id: '12345' },
      });
      req.session.visitedContactTribunalSelection = true;
      req.url = '/contact-the-tribunal/withdraw';
      req.get = jest.fn();
      const res = mockResponse();

      const result = await controller.testAsyncMethod(req, res);

      expect(result).toBe('async method executed');
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should handle async methods correctly when redirect occurs', async () => {
      const req = mockRequest({
        userCase: { id: '12345' },
      });
      req.session.visitedContactTribunalSelection = false;
      req.url = '/contact-the-tribunal/withdraw';
      req.get = jest.fn();
      const res = mockResponse();

      const result = await controller.testAsyncMethod(req, res);

      expect(result).toBeUndefined();
      expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/12345?lng=en');
    });

    it('should preserve method context (this binding)', () => {
      const req = mockRequest({
        userCase: { id: '12345' },
      });
      req.session.visitedContactTribunalSelection = true;
      req.url = '/contact-the-tribunal/withdraw';
      req.get = jest.fn();
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
      const decoratedMethod = FormSubmissionCheck()(controller, 'testMethod', {
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
        userCase: { id: '12345' },
      });
      req.session.visitedContactTribunalSelection = true;
      req.url = '/contact-the-tribunal/withdraw';
      req.get = jest.fn();
      const res = mockResponse();
      const additionalArg = 'extra argument';

      // Create a method that accepts additional arguments
      const methodWithArgs = jest.fn((requestArg: AppRequest, responseArg: Response, extra: string) => {
        return `method executed with ${extra}`;
      });

      // Apply decorator
      const decoratedMethod = FormSubmissionCheck()(controller, 'testMethod', {
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
});
