import HearingDocumentFileController from '../../../main/controllers/HearingDocumentFileController';
import { mockHearingCollection } from '../mocks/mockHearing';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Document File controller', () => {
  it('should return PageUrls.HEARING_DOCUMENT_UPLOAD', () => {
    const controller = new HearingDocumentFileController();
    const req = mockRequest({});
    const res = mockResponse();
    req.session.userCase.hearingCollection = mockHearingCollection;
    req.params.hearingId = '12345-abc-12345';

    controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/hearing-document-upload/12345-abc-12345?lng=en');
  });

  it('should return ErrorPages.NOT_FOUND', () => {
    const controller = new HearingDocumentFileController();
    const req = mockRequest({});
    const res = mockResponse();
    req.session.userCase.hearingCollection = mockHearingCollection;
    req.params.hearingId = 'test';

    controller.get(req, res);
    expect(res.redirect).toHaveBeenCalledWith('/not-found?lng=en');
  });
});
