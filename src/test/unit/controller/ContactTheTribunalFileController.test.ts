import ContactTheTribunalFileController from '../../../main/controllers/ContactTheTribunalFileController';
import { getLanguageParam } from '../../../main/controllers/helpers/RouterHelpers';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Contact the tribunal file controller', () => {
  it('should remove uploaded file and refresh the page', () => {
    const controller = new ContactTheTribunalFileController();
    const req = mockRequest({});
    req.params.application = 'withdraw';
    const res = mockResponse();
    const userCase = req.session.userCase;
    userCase.contactApplicationFile = {
      document_url: '12345',
      document_filename: 'test.pdf',
      document_binary_url: '',
      document_size: 1000,
      document_mime_type: 'pdf',
    };

    controller.get(req, res);
    const redirectUrl =
      PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', req.params.application) + getLanguageParam(req.url);

    expect(req.session.userCase.contactApplicationFile).toEqual(undefined);
    expect(res.redirect).toHaveBeenCalledWith(redirectUrl);
  });
});
