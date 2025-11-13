import AxiosInstance, { AxiosResponse } from 'axios';

import ChangeLegalRepresentativeController from '../../../main/controllers/ChangeLegalRepresentativeController';
import { CaseApiDataResponse } from '../../../main/definitions/api/caseApiResponse';
import { AppRequest } from '../../../main/definitions/appRequest';
import { LEGAL_REPRESENTATIVE_CHANGE_OPTIONS, PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import * as CaseService from '../../../main/services/CaseService';
import { CaseApi } from '../../../main/services/CaseService';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const changeLegalRepresentativeController = new ChangeLegalRepresentativeController();
const mockCaseApi = {
  axios: AxiosInstance,
  removeClaimantRepresentative: jest.fn(),
};
const caseApi: CaseApi = mockCaseApi as unknown as CaseApi;
jest.spyOn(CaseService, 'getCaseApi').mockReturnValue(caseApi);
caseApi.removeClaimantRepresentative = jest.fn().mockResolvedValue(
  Promise.resolve({
    data: {
      id: '1234',
      created_date: '2022-08-19T09:19:25.79202',
      last_modified: '2022-08-19T09:19:25.817549',
    },
  } as AxiosResponse<CaseApiDataResponse>)
);

describe('ChangeLegalRepresentative Controller', () => {
  it('should render the change legal representative page', () => {
    const response = mockResponse();
    const request = mockRequest({});
    request.session.userCase.id = '1234567890123456';
    changeLegalRepresentativeController.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.CHANGE_LEGAL_REPRESENTATIVE, expect.anything());
  });

  it('should render the appoint legal representative page when change radio button is selected', async () => {
    const body = { legalRep: LEGAL_REPRESENTATIVE_CHANGE_OPTIONS.change };

    const req = mockRequest({ body });
    const res = mockResponse();
    await changeLegalRepresentativeController.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.APPOINT_LEGAL_REPRESENTATIVE);
  });

  it('should render the citizen hub page when remove radio button is selected', async () => {
    const body = { legalRep: LEGAL_REPRESENTATIVE_CHANGE_OPTIONS.remove };

    const userCase = { id: '1234567890123456' };
    const request = <AppRequest>mockRequest({ userCase });
    request.body = body;
    const res = mockResponse();
    await changeLegalRepresentativeController.post(request, res);

    expect(res.redirect).toHaveBeenCalledWith('/citizen-hub/1234567890123456?lng=en');
  });
});
