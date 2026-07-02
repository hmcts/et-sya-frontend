import { nextTick } from 'process';

import axios from 'axios';

import TransferredCaseController from '../../../main/controllers/TransferredCaseController';
import { CaseTransferInfoResponse } from '../../../main/definitions/api/caseTransferInfoResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { ErrorPages, TranslationKeys } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);

const mockClient = jest.spyOn(CaseService, 'getCaseApi');
mockClient.mockReturnValue(caseApi);

const transferredCaseTranslations = {
  title: 'Case overview',
  header: 'Case overview - ',
  noAccessBodyEcm: 'ECM body',
  noAccessBodyCrossCountry: 'Cross country body',
};

const mockTransferredCaseTranslations = (request: AppRequest): void => {
  jest.mocked(request.t).mockImplementation((key: string, options?: { returnObjects?: boolean }) => {
    if (options?.returnObjects) {
      return transferredCaseTranslations;
    }
    return key;
  });
};

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
    mockTransferredCaseTranslations(request);

    controller.get(request, response);
    await new Promise(nextTick);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        pageHeading: 'Case overview',
        caseNumber: '60000001/2022',
        replacementCaseNumber: '18850001/2020',
        showNewCaseNumber: true,
        noAccessBody: 'ECM body',
      })
    );
  });

  it('should store party names on case transfer info and build the page heading from them', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({
      userCase: {
        id: '1234',
        firstName: 'Peter',
        lastName: 'Rabbit',
        respondents: [{ respondentName: "McGregor's Farm" }],
      },
    });
    request.session.caseTransferInfo = {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: '1234',
      originalEthosCaseReference: '6010106/2024',
      transferComplete: true,
    };
    mockTransferredCaseTranslations(request);

    controller.get(request, response);
    await new Promise(nextTick);

    expect(request.session.caseTransferInfo).toEqual(
      expect.objectContaining({
        claimantFirstName: 'Peter',
        claimantLastName: 'Rabbit',
        respondentName: "McGregor's Farm",
      })
    );
    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        pageHeading: "Case overview - Peter Rabbit vs McGregor's Farm",
      })
    );
  });

  it('should build the page heading from stored transfer info when user case is no longer available', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.caseTransferInfo = {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: '1234',
      originalEthosCaseReference: '6010106/2024',
      transferComplete: true,
      claimantFirstName: 'Peter',
      claimantLastName: 'Rabbit',
      respondentName: "McGregor's Farm",
    };
    mockTransferredCaseTranslations(request);

    controller.get(request, response);
    await new Promise(nextTick);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        pageHeading: "Case overview - Peter Rabbit vs McGregor's Farm",
      })
    );
  });

  it('should render the transferred case page when get is invoked without class context', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.session.caseTransferInfo = {
      transferred: true,
      transferType: 'ECM',
      originalCaseId: '1234',
      originalEthosCaseReference: '60000001/2022',
      transferComplete: false,
    };
    mockTransferredCaseTranslations(request);

    const unboundGet = controller.get;
    await unboundGet(request, response);

    expect(response.render).toHaveBeenCalledWith(
      TranslationKeys.TRANSFERRED_CASE,
      expect.objectContaining({
        caseNumber: '60000001/2022',
        noAccessBody: 'ECM body',
      })
    );
  });

  it('should fetch transfer info when case id is provided in query', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    mockTransferredCaseTranslations(request);
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

  it('should redirect to not found when transfer info cannot be loaded with an unrelated error', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not found'));

    controller.get(request, response);
    await new Promise(nextTick);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should redirect to not found when transfer info cannot be loaded and no case id is provided', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    caseApi.getCaseTransferInfo = jest.fn().mockRejectedValue(new Error('not found'));

    controller.get(request, response);
    await new Promise(nextTick);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should redirect to not found when transfer info says case is not transferred', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    caseApi.getCaseTransferInfo = jest.fn().mockResolvedValue({
      data: {
        transferred: false,
        transferType: 'ECM',
        transferComplete: false,
      } as CaseTransferInfoResponse,
    });

    controller.get(request, response);
    await new Promise(nextTick);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });

  it('should redirect to not found when case not found error is returned from transfer info api', async () => {
    const controller = new TransferredCaseController();
    const response = mockResponse();
    const request = mockRequest({});
    request.query = { caseId: '1234' };
    caseApi.getCaseTransferInfo = jest
      .fn()
      .mockRejectedValue(new Error('Error getting case transfer info: status code 404, CaseNotFoundException'));

    controller.get(request, response);
    await new Promise(nextTick);

    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });
});
