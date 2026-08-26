import { Response } from 'express';

import {
  AdditionalClaimantCheck,
  checkAdditionalClaimantAndRedirect,
} from '../../../main/decorators/AdditionalClaimantEditCheck';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('AdditionalClaimantEditCheck', () => {
  describe('checkAdditionalClaimantAndRedirect', () => {
    it('should allow through when query is new-claimant, flag is active and under max capacity', () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.query = { additionalClaimant: 'new-claimant' };
      req.session.additionalClaimantNewFlow = true;
      req.session.userCase.additionalClaimants = [{ firstName: 'Jane', lastName: 'Doe' }];

      const result = checkAdditionalClaimantAndRedirect(req, res);

      expect(result).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should redirect when query is new-claimant but flag is not active', () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.query = { additionalClaimant: 'new-claimant' };
      req.session.additionalClaimantNewFlow = false;
      req.session.userCase.additionalClaimants = [];
      req.url = '/some-page';

      const result = checkAdditionalClaimantAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining(PageUrls.REVIEW_ADDITIONAL_CLAIMANTS));
    });

    it(
      'should allow through when query is new-claimant, flag is active and at capacity (5 claimants) ' +
        '- IMPOSSIBLE scenario - additionalClaimantNewFlow can only being set to true on ReviewAdditionalClaimants and ' +
        'selecting Yes, but the fields are hidden when capacity of 5 is hit',
      () => {
        const req = mockRequest({});
        const res = mockResponse();
        req.query = { additionalClaimant: 'new-claimant' };
        req.session.additionalClaimantNewFlow = true;
        req.session.userCase.additionalClaimants = [
          { firstName: 'A' },
          { firstName: 'B' },
          { firstName: 'C' },
          { firstName: 'D' },
          { firstName: 'E' },
        ];

        const result = checkAdditionalClaimantAndRedirect(req, res);

        expect(result).toBe(false);
        expect(res.redirect).not.toHaveBeenCalled();
      }
    );

    it('should redirect when query is undefined and flag is inactive', () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.query = {};
      req.session.additionalClaimantNewFlow = false;
      req.url = '/some-page';

      const result = checkAdditionalClaimantAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining(PageUrls.REVIEW_ADDITIONAL_CLAIMANTS));
    });

    it('should redirect when query is null and flag is inactive', () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.query = { additionalClaimant: null as any };
      req.session.additionalClaimantNewFlow = false;
      req.url = '/some-page';

      const result = checkAdditionalClaimantAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining(PageUrls.REVIEW_ADDITIONAL_CLAIMANTS));
    });

    it('should redirect when query is empty string and flag is inactive', () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.query = { additionalClaimant: '' };
      req.session.additionalClaimantNewFlow = false;
      req.url = '/some-page';

      const result = checkAdditionalClaimantAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(expect.stringContaining(PageUrls.REVIEW_ADDITIONAL_CLAIMANTS));
    });

    it('should allow through for numeric edit index (edit flow)', () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.query = { additionalClaimant: '0' };

      const result = checkAdditionalClaimantAndRedirect(req, res);

      expect(result).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should allow through for any non-empty, non-new-claimant value', () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.query = { additionalClaimant: '3' };

      const result = checkAdditionalClaimantAndRedirect(req, res);

      expect(result).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });

  describe('AdditionalClaimantCheck decorator', () => {
    class TestController {
      @AdditionalClaimantCheck()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public testMethod(_req: AppRequest, _res: Response): string {
        return 'method executed';
      }

      @AdditionalClaimantCheck()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public async testAsyncMethod(_req: AppRequest, _res: Response): Promise<string> {
        return 'async method executed';
      }
    }

    let controller: TestController;

    beforeEach(() => {
      controller = new TestController();
    });

    it('should execute original method when check passes (edit flow)', () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.query = { additionalClaimant: '0' };

      const result = controller.testMethod(req, res);

      expect(result).toBe('method executed');
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should not execute original method when redirect occurs', () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.query = {};
      req.session.additionalClaimantNewFlow = false;
      req.url = '/some-page';

      const result = controller.testMethod(req, res);

      expect(result).toBeUndefined();
      expect(res.redirect).toHaveBeenCalled();
    });

    it('should handle async methods when check passes', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.query = { additionalClaimant: '1' };

      const result = await controller.testAsyncMethod(req, res);

      expect(result).toBe('async method executed');
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should handle async methods when redirect occurs', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.query = {};
      req.session.additionalClaimantNewFlow = false;
      req.url = '/some-page';

      const result = await controller.testAsyncMethod(req, res);

      expect(result).toBeUndefined();
      expect(res.redirect).toHaveBeenCalled();
    });
  });
});
