import RespondentSupportingMaterialFileController from '../../../main/controllers/RespondentSupportingMaterialFileController';
import { getLanguageParam } from '../../../main/controllers/helpers/RouterHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Respondent supporting material file controller', () => {
  it('should remove uploaded file and refresh the page', () => {
    const controller = new RespondentSupportingMaterialFileController();
    const req = mockRequest({});
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
});
