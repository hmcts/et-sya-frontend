import AxiosInstance, { AxiosResponse } from 'axios';

import StoredToSubmitResponseController from '../../../main/controllers/StoredToSubmitResponseController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { GenericTseApplicationTypeItem } from '../../../main/definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { HubLinksStatuses } from '../../../main/definitions/hub';
import applicationDetailsJsonRaw from '../../../main/resources/locales/en/translation/application-details.json';
import yourApplicationsJsonRaw from '../../../main/resources/locales/en/translation/your-applications.json';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest, mockRequestWithTranslation } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

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
      respondCollection: [
        {
          id: '567',
          value: {
            from: 'Claimant',
            date: '06 Oct 2023',
            response: 'Test response',
            copyToOtherParty: 'Yes',
          },
        },
      ],
    },
  },
];

const userCase: Partial<CaseWithId> = {
  id: '123',
  genericTseApplicationCollection: tseAppCollection,
};

const controller = new StoredToSubmitResponseController();

describe('Stored to Submit Controller GET', () => {
  it('should render the stored to submit page', async () => {
    const translationJsons = { ...yourApplicationsJsonRaw, ...applicationDetailsJsonRaw };
    const res = mockResponse();
    const req = mockRequestWithTranslation({ session: { userCase } }, translationJsons);
    req.params.appId = '234';
    req.params.responseId = '567';
    req.url = '/stored-to-submit-response/234/567?lng=en';

    await controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(
      TranslationKeys.STORED_TO_SUBMIT,
      expect.objectContaining({
        applicationType: 'Application to Amend my claim',
        viewCorrespondenceLink: '/application-details/234?lng=en',
        cancelLink: '/citizen-hub/123?lng=en',
      })
    );
  });

  it('should return error page when Selected application not found', async () => {
    const translationJsons = { ...yourApplicationsJsonRaw, ...applicationDetailsJsonRaw };
    const res = mockResponse();
    const req = mockRequestWithTranslation({ session: { userCase } }, translationJsons);
    req.params.appId = 'Test';

    await controller.get(req, res);

    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});

describe('Stored to Submit Controller POST', () => {
  jest.mock('axios');
  const mockCaseApi = {
    axios: AxiosInstance,
    updateHubLinksStatuses: jest.fn(),
    storedToSubmitRespondToApp: jest.fn(),
  };
  const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

  caseApi.updateDraftCase = jest.fn().mockResolvedValue(
    Promise.resolve({
      data: {
        created_date: '2022-08-19T09:19:25.79202',
        last_modified: '2022-08-19T09:19:25.817549',
        case_data: {
          genericTseApplicationCollection: tseAppCollection,
        },
      },
    } as AxiosResponse<CaseApiDataResponse>)
  );

  it('should redirect to update page when yes is selected', async () => {
    const body = { confirmCopied: YesOrNo.YES };
    const req = mockRequest({ body, session: { userCase } });
    const res = mockResponse();
    req.params.appId = '234';
    req.url = '/stored-to-submit-response/234/567?lng=en';
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
    req.url = '/stored-to-submit-response/234/567?lng=en';
    req.session.errors = [];

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith('/stored-to-submit-response/234/567?lng=en');
    expect(req.session.errors).toEqual(errors);
  });
});

describe('Stored to Submit Controller POST return error page', () => {
  const body = { confirmCopied: YesOrNo.YES };
  const req = mockRequest({ body, session: { userCase } });
  const res = mockResponse();
  req.params.appId = '234';
  req.url = '/stored-to-submit-response/234/567?lng=en';
  req.session.userCase.hubLinksStatuses = new HubLinksStatuses();
  req.session.userCase.selectedGenericTseApplication = tseAppCollection[0];

  it('should redirect to update page when yes is selected', async () => {
    jest.mock('axios');
    const mockCaseApi = {
      axios: AxiosInstance,
    };
    const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
    jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND + '?lng=en');
  });
});
