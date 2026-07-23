import axios from 'axios';

import {
  buildTransferredCasePageHeading,
  buildTransferredCaseRedirectUrl,
  clearCaseTransferInfoIfStale,
  getRequestedCaseId,
  getTransferredCaseNoAccessBody,
  handleTransferredCaseRedirect,
  saveSessionAndRedirectToTransferredCase,
} from '../../../../main/controllers/helpers/CaseTransferHelper';
import { CaseTransferInfoResponse } from '../../../../main/definitions/api/caseTransferInfoResponse';
import { PageUrls, languages } from '../../../../main/definitions/constants';
import { CaseApi } from '../../../../main/services/CaseService';
import * as CaseService from '../../../../main/services/CaseService';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

const transferredCaseInfo: CaseTransferInfoResponse = {
  transferred: true,
  transferType: 'ECM',
  originalCaseId: '20548',
  transferComplete: false,
};

const translations = {
  title: 'Case overview',
  header: 'Case overview - ',
  noAccessBodyEcm: 'ECM body',
  noAccessBodyCrossCountry: 'Cross country body',
};

describe('CaseTransferHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    caseApi.getCaseTransferInfo = jest.fn();
  });

  describe('getRequestedCaseId', () => {
    it('should return case id from query string', () => {
      const req = mockRequest({});
      req.query = { caseId: '1234' };

      expect(getRequestedCaseId(req)).toBe('1234');
    });

    it('should return session case id when query is missing', () => {
      const req = mockRequest({});
      req.session.caseTransferInfo = {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '5678',
        transferComplete: true,
      };

      expect(getRequestedCaseId(req)).toBe('5678');
    });

    it('should return undefined when query case id is an array', () => {
      const req = mockRequest({});
      req.query = { caseId: ['1234', '5678'] };

      expect(getRequestedCaseId(req)).toBeUndefined();
    });

    it('should return undefined when query case id is blank', () => {
      const req = mockRequest({});
      req.query = { caseId: '   ' };

      expect(getRequestedCaseId(req)).toBeUndefined();
    });
  });

  describe('getTransferredCaseNoAccessBody', () => {
    it('should return ECM copy for ECM transfers', () => {
      expect(getTransferredCaseNoAccessBody(translations, 'ECM')).toBe('ECM body');
    });

    it('should return cross country copy for cross country transfers', () => {
      expect(getTransferredCaseNoAccessBody(translations, 'CROSS_COUNTRY')).toBe('Cross country body');
    });

    it('should default to ECM copy when transfer type is missing', () => {
      expect(getTransferredCaseNoAccessBody(translations)).toBe('ECM body');
    });
  });

  describe('clearCaseTransferInfoIfStale', () => {
    it('should clear transfer info when switching to a different case', () => {
      const req = mockRequest({});
      req.session.caseTransferInfo = {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '1111',
        transferComplete: true,
      };

      clearCaseTransferInfoIfStale(req, '2222');

      expect(req.session.caseTransferInfo).toBeUndefined();
    });

    it('should keep transfer info when case id matches', () => {
      const req = mockRequest({});
      req.session.caseTransferInfo = {
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '1111',
        transferComplete: true,
      };

      clearCaseTransferInfoIfStale(req, '1111');

      expect(req.session.caseTransferInfo?.originalCaseId).toBe('1111');
    });
  });

  describe('buildTransferredCasePageHeading', () => {
    it('should build a heading from party names when available', () => {
      expect(
        buildTransferredCasePageHeading(translations, {
          transferred: true,
          transferType: 'ECM',
          transferComplete: true,
          claimantFirstName: 'Peter',
          claimantLastName: 'Rabbit',
          respondentName: "McGregor's Farm",
        })
      ).toBe("Case overview - Peter Rabbit vs McGregor's Farm");
    });

    it('should fall back to title when party names are incomplete', () => {
      expect(
        buildTransferredCasePageHeading(translations, {
          transferred: true,
          transferType: 'ECM',
          transferComplete: true,
          claimantFirstName: 'Peter',
        })
      ).toBe('Case overview');
    });
  });

  describe('buildTransferredCaseRedirectUrl', () => {
    it('should preserve Welsh language in redirect url', () => {
      const req = mockRequest({});
      req.url = `${PageUrls.CITIZEN_HUB.replace(':caseId', '20548')}${languages.WELSH_URL_PARAMETER}`;

      expect(buildTransferredCaseRedirectUrl(req, '20548')).toBe(
        `${PageUrls.TRANSFERRED_CASE}${languages.WELSH_URL_PARAMETER}&caseId=20548`
      );
    });
  });

  describe('handleTransferredCaseRedirect', () => {
    it('should redirect with transfer info when case is transferred', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '20548',
          originalEthosCaseReference: '60000001/2022',
          transferComplete: true,
        },
      });
      const req = mockRequest({
        userCase: {
          id: '20548',
          firstName: 'Peter',
          lastName: 'Rabbit',
          respondents: [{ respondentName: "McGregor's Farm" }],
        },
      });
      req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548');
      const res = mockResponse();

      const redirected = await handleTransferredCaseRedirect(req, res, '20548');

      expect(redirected).toBe(true);
      expect(req.session.caseTransferInfo).toEqual(
        expect.objectContaining({
          originalEthosCaseReference: '60000001/2022',
          claimantFirstName: 'Peter',
          claimantLastName: 'Rabbit',
          respondentName: "McGregor's Farm",
        })
      );
      expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=20548`);
    });

    it('should redirect when getUserCase failed with a 404 and transfer-info confirms transfer', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '20548',
          transferComplete: false,
        },
      });
      const req = mockRequest({});
      req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548');
      const res = mockResponse();

      const redirected = await handleTransferredCaseRedirect(
        req,
        res,
        '20548',
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );

      expect(redirected).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=20548`);
    });

    it('should not redirect when getUserCase fails with a non-404 error', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '20548',
          transferComplete: false,
        },
      });
      const req = mockRequest({});
      req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548');
      const res = mockResponse();

      const redirected = await handleTransferredCaseRedirect(
        req,
        res,
        '20548',
        new Error('Error getting user case: Request failed with status code 500')
      );

      expect(redirected).toBe(false);
      expect(caseApi.getCaseTransferInfo).not.toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should not redirect when transfer-info is unavailable', async () => {
      caseApi.getCaseTransferInfo = jest
        .fn()
        .mockRejectedValue(new Error('Error getting case transfer info: status code 404'));
      const req = mockRequest({});
      const res = mockResponse();

      const redirected = await handleTransferredCaseRedirect(req, res, '20548');

      expect(redirected).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should not redirect when transfer-info says case is not transferred', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: false,
          transferType: 'ECM',
          transferComplete: false,
        },
      });
      const req = mockRequest({});
      const res = mockResponse();

      const redirected = await handleTransferredCaseRedirect(
        req,
        res,
        '20548',
        new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
      );

      expect(redirected).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should not redirect when transfer-info originalCaseId does not match requested case', async () => {
      caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
        data: {
          transferred: true,
          transferType: 'ECM',
          originalCaseId: '99999',
          transferComplete: false,
        },
      });
      const req = mockRequest({});
      const res = mockResponse();

      const redirected = await handleTransferredCaseRedirect(req, res, '20548');

      expect(redirected).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });

  describe('saveSessionAndRedirectToTransferredCase', () => {
    it('should still redirect when session save fails', async () => {
      const req = mockRequest({});
      req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548');
      req.session.save = jest.fn((done?: (err?: Error) => void) => {
        done?.(new Error('session save failed'));
        return req.session;
      });
      const res = mockResponse();

      const redirected = await saveSessionAndRedirectToTransferredCase(req, res, '20548', transferredCaseInfo);

      expect(redirected).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=20548`);
    });

    it('should still redirect when session save times out', async () => {
      jest.useFakeTimers();
      const req = mockRequest({});
      req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548');
      req.session.save = jest.fn();
      const res = mockResponse();

      const redirectPromise = saveSessionAndRedirectToTransferredCase(req, res, '20548', transferredCaseInfo);
      jest.advanceTimersByTime(10000);

      await expect(redirectPromise).resolves.toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=20548`);
      jest.useRealTimers();
    });
  });
});
