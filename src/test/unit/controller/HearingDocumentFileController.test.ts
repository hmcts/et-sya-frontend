import HearingDocumentFileController from '../../../main/controllers/HearingDocumentFileController';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Document File controller', () => {
  it('should return PageUrls.HEARING_DOCUMENT_UPLOAD', () => {
    const controller = new HearingDocumentFileController();
    const req = mockRequest({});
    const res = mockResponse();
    req.session.userCase.genericTseApplicationCollection = [{ id: '123', value: {} }];
    req.params.appId = '123';

    controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/hearing-document-upload/123?lng=en');
  });

  it('should return ErrorPages.NOT_FOUND', () => {
    const controller = new HearingDocumentFileController();
    const req = mockRequest({});
    const res = mockResponse();
    req.session.userCase.genericTseApplicationCollection = [{ id: '123', value: {} }];
    req.params.appId = 'test';

    controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/not-found?lng=en');
  });
});
