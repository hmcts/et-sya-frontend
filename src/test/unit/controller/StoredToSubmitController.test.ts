import axios, { AxiosResponse } from 'axios';

import StoredToSubmitController from '../../../main/controllers/StoredToSubmitController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { CaseWithId, YesOrNo } from '../../../main/definitions/case';
import { InterceptPaths, PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { CaseApi } from '../../../main/services/CaseService';
import * as CaseService from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Stored to Submit Controller', () => {
  jest.mock('axios');
  const caseApi = new CaseApi(axios as jest.Mocked<typeof axios>);
  jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
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

  const t = {
    'stored-to-submit': {},
    'your-applications': { 'Amend my claim': 'Amend my claim' },
    'application-details': { applicationTo: 'Application to ' },
    common: {},
  };
  const tseAppCollection = [
    {
      id: '1',
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
    genericTseApplicationCollection: tseAppCollection,
  };

  it('should render the stored to submit page', () => {
    const controller = new StoredToSubmitController();
    const res = mockResponse();
    const req = mockRequest({ t, session: { userCase } });
    req.params.appId = '1';

    controller.get(req, res);

    expect(res.render).toHaveBeenCalledWith(TranslationKeys.STORED_TO_SUBMIT, expect.anything());
  });

  it('should redirect to update page when yes is selected', async () => {
    const body = { confirmCopied: YesOrNo.YES };

    const controller = new StoredToSubmitController();

    const req = mockRequest({ body, session: { userCase } });
    const res = mockResponse();
    req.params.appId = '1';
    req.url = PageUrls.STORED_TO_SUBMIT + languages.ENGLISH_URL_PARAMETER;

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(InterceptPaths.STORED_TO_SUBMIT_UPDATE + languages.ENGLISH_URL_PARAMETER);
  });

  it('should render the same page when nothing is selected', async () => {
    const errors = [{ propertyName: 'confirmCopied', errorType: 'required' }];
    const body = { continue: true };

    const controller = new StoredToSubmitController();
    const req = mockRequest({ body });
    const res = mockResponse();
    req.url = PageUrls.STORED_TO_SUBMIT + languages.ENGLISH_URL_PARAMETER;
    req.session.errors = [];

    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.STORED_TO_SUBMIT + languages.ENGLISH_URL_PARAMETER);
    expect(req.session.errors).toEqual(errors);
  });
});
