import RespondentSupportingMaterialFileController from '../../../main/controllers/RespondentSupportingMaterialFileController';
import * as routerHelpers from '../../../main/controllers/helpers/RouterHelpers';
import { getLanguageParam } from '../../../main/controllers/helpers/RouterHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { safeUrlMock } from '../mocks/mockUrl';

describe('Respondent supporting material file controller', () => {
  it('should remove uploaded file and refresh the page', () => {
    jest.spyOn(routerHelpers, 'getParsedUrl').mockReturnValue(safeUrlMock);

    const controller = new RespondentSupportingMaterialFileController();
    const req = mockRequest({});
    req.session.userCase.genericTseApplicationCollection = [{ id: '1' }];
    req.params.appId = '1';
    const res = mockResponse();
    const userCase = req.session.userCase;
    userCase.supportingMaterialFile = {
      document_url: '12345',
      document_filename: 'test.pdf',
      document_binary_url: '',
      document_size: 1000,
      document_mime_type: 'pdf',
    };

    controller.get(req, res);
    const redirectUrl =
      PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', req.params.appId) + getLanguageParam(req.url);

    expect(req.session.userCase.supportingMaterialFile).toEqual(undefined);
    expect(res.redirect).toHaveBeenCalledWith(redirectUrl);
  });

  it('should redirect error page when req.params.appId not found', () => {
    const controller = new RespondentSupportingMaterialFileController();
    const req = mockRequest({});
    const res = mockResponse();
    req.session.userCase.genericTseApplicationCollection = [{ id: '1' }];
    req.params.appId = 'test';

    controller.get(req, res);
    const expected = '/not-found?lng=en';

    expect(res.redirect).toHaveBeenCalledWith(expected);
  });
});
