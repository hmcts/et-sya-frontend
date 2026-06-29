import axios from 'axios';

import {
  createFallbackTransferInfo,
  handleTransferredCaseRedirect,
  saveSessionAndRedirectToTransferredCase,
  shouldFallbackToTransferredCase,
} from '../../../../main/controllers/helpers/CaseTransferHelper';
import { PageUrls } from '../../../../main/definitions/constants';
import { CaseApi } from '../../../../main/services/CaseService';
import * as CaseService from '../../../../main/services/CaseService';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

describe('CaseTransferHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    caseApi.getCaseTransferInfo = jest.fn();
  });

  describe('createFallbackTransferInfo', () => {
    it('should create ECM fallback transfer info', () => {
      expect(createFallbackTransferInfo('20548')).toEqual({
        transferred: true,
        transferType: 'ECM',
        originalCaseId: '20548',
        transferComplete: false,
      });
    });
  });

  describe('shouldFallbackToTransferredCase', () => {
    it('should return true for ECM transfer errors', () => {
      expect(
        shouldFallbackToTransferredCase(
          new Error('Error getting user case: Request failed with status code 410, CASE_TRANSFERRED_TO_ECM')
        )
      ).toBe(true);
    });

    it('should return true for case not found errors', () => {
      expect(
        shouldFallbackToTransferredCase(
          new Error('Error getting user case: Request failed with status code 404, CaseNotFoundException')
        )
      ).toBe(true);
    });

    it('should return false for unrelated errors', () => {
      expect(shouldFallbackToTransferredCase(new Error('Error getting user case: status code 500'))).toBe(false);
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
      const req = mockRequest({});
      req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548');
      const res = mockResponse();

      const redirected = await handleTransferredCaseRedirect(req, res, '20548');

      expect(redirected).toBe(true);
      expect(req.session.caseTransferInfo?.originalEthosCaseReference).toBe('60000001/2022');
      expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=20548`);
    });

    it('should fallback redirect when transfer-info is unavailable and original error indicates ECM transfer', async () => {
      caseApi.getCaseTransferInfo = jest
        .fn()
        .mockRejectedValue(
          new Error(
            'Error getting case transfer info: Request failed with status code 404, {"detail":"No static resource cases/20548/transfer-info."}'
          )
        );
      const req = mockRequest({});
      req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548');
      const res = mockResponse();
      const originalError = new Error(
        'Error getting user case: Request failed with status code 410, CASE_TRANSFERRED_TO_ECM'
      );

      const redirected = await handleTransferredCaseRedirect(req, res, '20548', originalError);

      expect(redirected).toBe(true);
      expect(req.session.caseTransferInfo).toEqual(createFallbackTransferInfo('20548'));
      expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=20548`);
    });

    it('should fallback redirect when transfer-info is unavailable and original error is case not found', async () => {
      caseApi.getCaseTransferInfo = jest
        .fn()
        .mockRejectedValue(new Error('Error getting case transfer info: status code 404'));
      const req = mockRequest({});
      req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548');
      const res = mockResponse();
      const originalError = new Error(
        'Error getting user case: Request failed with status code 404, CaseNotFoundException'
      );

      const redirected = await handleTransferredCaseRedirect(req, res, '20548', originalError);

      expect(redirected).toBe(true);
      expect(req.session.caseTransferInfo).toEqual(createFallbackTransferInfo('20548'));
      expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=20548`);
    });

    it('should not redirect when transfer-info fails and original error is unrelated', async () => {
      caseApi.getCaseTransferInfo = jest
        .fn()
        .mockRejectedValue(new Error('Error getting case transfer info: status code 404'));
      const req = mockRequest({});
      const res = mockResponse();

      const redirected = await handleTransferredCaseRedirect(
        req,
        res,
        '20548',
        new Error('Error getting user case: status code 500')
      );

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

      const redirected = await handleTransferredCaseRedirect(req, res, '20548');

      expect(redirected).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });

  describe('saveSessionAndRedirectToTransferredCase', () => {
    it('should return false when session save fails', async () => {
      const req = mockRequest({});
      req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548');
      req.session.save = jest.fn((done?: (err?: Error) => void) => {
        done?.(new Error('session save failed'));
        return req.session;
      });
      const res = mockResponse();

      const redirected = await saveSessionAndRedirectToTransferredCase(
        req,
        res,
        '20548',
        createFallbackTransferInfo('20548')
      );

      expect(redirected).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should return false when session save times out', async () => {
      jest.useFakeTimers();
      const req = mockRequest({});
      req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548');
      req.session.save = jest.fn();
      const res = mockResponse();

      const redirectPromise = saveSessionAndRedirectToTransferredCase(
        req,
        res,
        '20548',
        createFallbackTransferInfo('20548')
      );
      jest.advanceTimersByTime(10000);

      await expect(redirectPromise).resolves.toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
      jest.useRealTimers();
    });
  });
});
