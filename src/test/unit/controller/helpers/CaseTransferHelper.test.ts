import axios from 'axios';

import {
  handleCaseAccessFailure,
  handleTransferredCaseRedirect,
  saveSessionAndRedirectToTransferredCase,
} from '../../../../main/controllers/helpers/CaseTransferHelper';
import { CaseTransferInfoResponse } from '../../../../main/definitions/api/caseTransferInfoResponse';
import { PageUrls } from '../../../../main/definitions/constants';
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

describe('CaseTransferHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    caseApi.getCaseTransferInfo = jest.fn();
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

      const redirected = await handleTransferredCaseRedirect(req, res, '20548');

      expect(redirected).toBe(false);
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });

  describe('handleCaseAccessFailure', () => {
    it('should redirect only when transfer-info confirms the case is transferred', async () => {
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

      const redirected = await handleCaseAccessFailure(req, res, '20548');

      expect(redirected).toBe(true);
      expect(res.redirect).toHaveBeenCalledWith(`${PageUrls.TRANSFERRED_CASE}?lng=en&caseId=20548`);
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
      req.url = PageUrls.CITIZEN_HUB.replace(':caseId', '20548');
      const res = mockResponse();

      const redirected = await handleCaseAccessFailure(req, res, '20548');

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
