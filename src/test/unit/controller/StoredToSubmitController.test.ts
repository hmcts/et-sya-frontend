import AxiosInstance, { AxiosResponse } from 'axios';

import StoredToSubmitController from '../../../main/controllers/StoredToSubmitController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import applicationDetailsJsonRaw from '../../../main/resources/locales/en/translation/application-details.json';
import yourApplicationsJsonRaw from '../../../main/resources/locales/en/translation/your-applications.json';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.mock('axios');
const mockCaseApi = {
  axios: AxiosInstance,
  createCase: jest.fn(),
  getUserCases: jest.fn(),
  downloadClaimPdf: jest.fn(),
  getCaseDocument: jest.fn(),
  getDocumentDetails: jest.fn(),
  updateDraftCase: jest.fn(),
  updateHubLinksStatuses: jest.fn(),
  submitClaimantTse: jest.fn(),
  storeClaimantTse: jest.fn(),
  storedToSubmitClaimantTse: jest.fn(),
  respondToApplication: jest.fn(),
  changeApplicationStatus: jest.fn(),
  updateSendNotificationState: jest.fn(),
  updateJudgmentNotificationState: jest.fn(),
  updateDecisionState: jest.fn(),
  addResponseSendNotification: jest.fn(),
  updateResponseAsViewed: jest.fn(),
  getUserCase: jest.fn(),
  submitCase: jest.fn(),
  uploadDocument: jest.fn(),
};
const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

describe('Stored to Submit Controller', () => {
  const controller = new StoredToSubmitController();

  caseApi.updateDraftCase = jest.fn().mockResolvedValue(
    Promise.resolve({
      data: {
        created_date: '2022-08-19T09:19:25.79202',
        last_modified: '2022-08-19T09:19:25.817549',
        case_data: {
          genericTseApplicationCollection: [
            {
              id: '1',
              value: {
                applicant: 'Claimant',
              },
            },
          ],
        },
      },
    } as AxiosResponse<CaseApiDataResponse>)
  );

  const tseAppCollection: GenericTseApplicationTypeItem[] = [
    {
      id: '234',
      value: {
        applicant: 'Claimant',
        date: '2022-05-05',
        type: 'Amend my claim',
        copyToOtherPartyText: 'Yes',
        details: 'Help',
        number: '1',
        status: 'Stored',
        applicationState: 'stored',
      },
    },
  ];
  const userCase: Partial<CaseWithId> = {
    id: '345',
    genericTseApplicationCollection: tseAppCollection,
  };

  it('should render the stored to submit page', () => {
    const translationJsons = { ...yourApplicationsJsonRaw, ...applicationDetailsJsonRaw };
    const res = mockResponse();
    const req = mockRequestWithTranslation({ session: { userCase } }, translationJsons);
    req.params.appId = '234';

    controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.STORED_TO_SUBMIT,
      expect.objectContaining({
        applicationType: 'Application to Amend my claim',
        viewCorrespondenceLink: '/application-details/234?lng=en',
        document: undefined,
        viewCorrespondenceFileLink: '',
        cancelLink: '/citizen-hub/345',
      })
    );
  });

  it('should redirect to update page when yes is selected', async () => {
    const body = { confirmCopied: YesOrNo.YES };
    const req = mockRequest({ body, session: { userCase } });
    const res = mockResponse();
    req.params.appId = '234';
    req.url = PageUrls.STORED_TO_SUBMIT + languages.ENGLISH_URL_PARAMETER;
    req.session.userCase.hubLinksStatuses = new HubLinksStatuses();
    req.session.userCase.selectedGenericTseApplication = tseAppCollection[0];

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.APPLICATION_COMPLETE + languages.ENGLISH_URL_PARAMETER);
  });

  it('should render the same page when nothing is selected', async () => {
    const errors = [{ propertyName: 'confirmCopied', errorType: 'required' }];
    const body = { continue: true };
    const req = mockRequest({ body });
    const res = mockResponse();
    req.url = PageUrls.STORED_TO_SUBMIT.replace(':appId', '1234') + languages.ENGLISH_URL_PARAMETER;
    req.session.errors = [];

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/stored-to-submit/1234?lng=en');
    expect(req.session.errors).toEqual(errors);
  });
});
