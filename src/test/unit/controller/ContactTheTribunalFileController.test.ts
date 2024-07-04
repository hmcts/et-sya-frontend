import ContactTheTribunalFileController from '../../../main/controllers/ContactTheTribunalFileController';
import * as routerHelpers from '../../../main/controllers/helpers/RouterHelpers';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';
import { safeUrlMock } from '../mocks/mockUrl';

describe('Contact the tribunal file controller', () => {
  jest.spyOn(routerHelpers, 'getParsedUrl').mockReturnValue(safeUrlMock);

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
    const redirectUrl = '/contact-the-tribunal/withdraw?lng=en';

    expect(req.session.userCase.contactApplicationFile).toEqual(undefined);
    expect(res.redirect).toHaveBeenCalledWith(redirectUrl);
  });

  it('should redirect to error page when req.params.application not found', () => {
    const controller = new ContactTheTribunalFileController();
    const req = mockRequest({});
    const res = mockResponse();
    req.params.application = 'test';

    controller.get(req, res);
    const expected = '/not-found?lng=en';

    expect(res.redirect).toHaveBeenCalledWith(expected);
  });
});
