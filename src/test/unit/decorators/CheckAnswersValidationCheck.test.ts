import { Response } from 'express';

import {
  CheckAnswersValidationCheck,
  checkAnswersValidationAndRedirect,
} from '../../../main/decorators/CheckAnswersValidationCheck';
import { AppRequest } from '../../../main/definitions/appRequest';
import { CaseType, YesOrNo } from '../../../main/definitions/case';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const validUserCase = {
  typeOfClaim: ['discrimination'],
  address1: '10 Test Street',
  addressTown: 'Test Town',
  addressCountry: 'United Kingdom',
  addressPostcode: 'AB1 2CD',
  caseType: CaseType.SINGLE,
  respondents: [
    {
      respondentAddress1: '20 Respondent Road',
      respondentAddressTown: 'Respondent Town',
      respondentAddressCountry: 'United Kingdom',
      respondentAddressPostcode: 'CD3 4EF',
      acasCert: YesOrNo.YES,
      acasCertNum: 'R123456-78-90',
    },
  ],
  claimSummaryText: 'This is what happened.',
};

describe('CheckAnswersValidationCheck Decorator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAnswersValidationAndRedirect function', () => {
    it('should redirect to CLAIMANT_APPLICATIONS when userCase is undefined', () => {
      const req = mockRequest({});
      req.session.userCase = undefined;
      const res = mockResponse();

      const result = checkAnswersValidationAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });

    it('should redirect to CLAIM_STEPS when typeOfClaim is undefined', () => {
      const req = mockRequest({ userCase: { ...validUserCase, typeOfClaim: undefined } });
      const res = mockResponse();

      const result = checkAnswersValidationAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
    });

    it('should redirect to CLAIM_STEPS when typeOfClaim is empty', () => {
      const req = mockRequest({ userCase: { ...validUserCase, typeOfClaim: [] } });
      const res = mockResponse();

      const result = checkAnswersValidationAndRedirect(req, res);

      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
    });

    it('should set personalDetailsCheck to NO and redirect when personal details are invalid', () => {
      const req = mockRequest({ userCase: { ...validUserCase, address1: undefined } });
      const res = mockResponse();

      const result = checkAnswersValidationAndRedirect(req, res);

      expect(req.session.userCase.personalDetailsCheck).toBe(YesOrNo.NO);
      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
    });

    it('should set employmentAndRespondentCheck to NO and redirect when respondents are missing', () => {
      const req = mockRequest({ userCase: { ...validUserCase, respondents: undefined } });
      const res = mockResponse();

      const result = checkAnswersValidationAndRedirect(req, res);

      expect(req.session.userCase.employmentAndRespondentCheck).toBe(YesOrNo.NO);
      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
    });

    it('should set claimDetailsCheck to NO and redirect when claim details are invalid', () => {
      const req = mockRequest({
        userCase: { ...validUserCase, claimSummaryText: undefined, claimSummaryFile: undefined },
      });
      const res = mockResponse();

      const result = checkAnswersValidationAndRedirect(req, res);

      expect(req.session.userCase.claimDetailsCheck).toBe(YesOrNo.NO);
      expect(result).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
    });

    it('should not redirect and should leave check fields unset when all sections are valid', () => {
      const req = mockRequest({ userCase: { ...validUserCase } });
      const res = mockResponse();

      const result = checkAnswersValidationAndRedirect(req, res);

      expect(result).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
      expect(req.session.userCase.personalDetailsCheck).toBeUndefined();
      expect(req.session.userCase.groupClaimsCheck).toBeUndefined();
      expect(req.session.userCase.employmentAndRespondentCheck).toBeUndefined();
      expect(req.session.userCase.claimDetailsCheck).toBeUndefined();
    });
  });

  describe('CheckAnswersValidationCheck decorator', () => {
    class TestController {
      @CheckAnswersValidationCheck()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      public testMethod(_req: AppRequest, _res: Response): string {
        return 'method executed';
      }
    }

    let controller: TestController;

    beforeEach(() => {
      controller = new TestController();
    });

    it('should execute the original method when all sections are valid', () => {
      const req = mockRequest({ userCase: { ...validUserCase } });
      const res = mockResponse();

      const result = controller.testMethod(req, res);

      expect(result).toBe('method executed');
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should not execute the original method when a redirect occurs', () => {
      const req = mockRequest({ userCase: { ...validUserCase, typeOfClaim: [] } });
      const res = mockResponse();

      const result = controller.testMethod(req, res);

      expect(result).toBeUndefined();
      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIM_STEPS);
    });
  });
});
