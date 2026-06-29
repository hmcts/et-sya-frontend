import { nextTick } from 'process';

import axios from 'axios';

import TransferredCaseController from '../../../main/controllers/TransferredCaseController';
import { CaseTransferInfoResponse } from '../../../main/definitions/api/caseTransferInfoResponse';
import { TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

describe('Transferred Case Controller tests', () => {
  beforeEach(() => {
    caseApi.getCaseTransferInfo = jest.fn();
  });

  it('should render the transferred case page with transfer info from session', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.caseTransferInfo = {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: '1234',
      originalEthosCaseReference: '60000001/2022',
      newEthosCaseReference: '18850001/2020',
      transferComplete: true,
    };
    (request.t as any).mockImplementation((key: string, options?: { returnObjects?: boolean }) => {
      if (options?.returnObjects) {
        return {
          h1: 'Your case has been transferred',
          noAccessBodyEcm: 'ECM body',
          noAccessBodyCrossCountry: 'Cross country body',
        };
      }
      return key;
    });

    controller.get(request, response);
    await new Promise(nextTick);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        caseNumber: '60000001/2022',
        replacementCaseNumber: '18850001/2020',
        showNewCaseNumber: true,
        noAccessBody: 'ECM body',
      })
    );
  });

  it('should fetch transfer info when case id is provided in query', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    (request.t as any).mockImplementation((key: string, options?: { returnObjects?: boolean }) => {
      if (options?.returnObjects) {
        return {
          h1: 'Your case has been transferred',
          noAccessBodyEcm: 'ECM body',
          noAccessBodyCrossCountry: 'Cross country body',
        };
      }
      return key;
    });
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: true,
        transferType: 'CROSS_COUNTRY',
        originalCaseId: '1234',
        originalEthosCaseReference: '60000001/2022',
        transferComplete: false,
      } as CaseTransferInfoResponse,
    });

    controller.get(request, response);
    await new Promise(nextTick);

    expect(caseApi.getCaseTransferInfo).toHaveBeenCalledWith('1234');
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        showNewCaseNumber: false,
        transferComplete: false,
        noAccessBody: 'Cross country body',
      })
    );
  });

  it('should render fallback page when transfer info cannot be loaded but case id is provided', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    (request.t as any).mockImplementation((key: string, options?: { returnObjects?: boolean }) => {
      if (options?.returnObjects) {
        return {
          h1: 'Your case has been transferred',
          noAccessBodyEcm: 'ECM body',
          noAccessBodyCrossCountry: 'Cross country body',
        };
      }
      return key;
    });
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not found'));

    controller.get(request, response);
    await new Promise(nextTick);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        showNewCaseNumber: false,
        transferComplete: false,
        noAccessBody: 'ECM body',
      })
    );
  });

  it('should redirect to not found when transfer info cannot be loaded and no case id is provided', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not found'));

    controller.get(request, response);
    await new Promise(nextTick);

    expect(response.redirect).toHaveBeenCalledWith('/not-found');
  });

  it('should render fallback page when transfer info says case is not transferred', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    (request.t as any).mockImplementation((key: string, options?: { returnObjects?: boolean }) => {
      if (options?.returnObjects) {
        return {
          h1: 'Your case has been transferred',
          noAccessBodyEcm: 'ECM body',
          noAccessBodyCrossCountry: 'Cross country body',
        };
      }
      return key;
    });
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: false,
        transferType: 'ECM',
        transferComplete: false,
      } as CaseTransferInfoResponse,
    });

    controller.get(request, response);
    await new Promise(nextTick);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        showNewCaseNumber: false,
        transferComplete: false,
        noAccessBody: 'ECM body',
      })
    );
  });

  it('should render fallback page when case not found error is returned from transfer info api', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    (request.t as any).mockImplementation((key: string, options?: { returnObjects?: boolean }) => {
      if (options?.returnObjects) {
        return {
          h1: 'Your case has been transferred',
          noAccessBodyEcm: 'ECM body',
          noAccessBodyCrossCountry: 'Cross country body',
        };
      }
      return key;
    });
    caseApi.getCaseTransferInfo = jest
      .fn()
      .mockRejectedValue(new Error('Error getting case transfer info: status code 404, CaseNotFoundException'));

    controller.get(request, response);
    await new Promise(nextTick);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        showNewCaseNumber: false,
        transferComplete: false,
      })
    );
  });
});
