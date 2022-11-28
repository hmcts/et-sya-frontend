import ChangeDetailsController from '../../../main/controllers/ChangeDetailsController';
import { ErrorPages, InterceptPaths, PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Change Details Controller', () => {
  it('should redirect to the same url with request.url and should set request.session.returnUrl to PageUrls.RESPONDENT_DETAILS_CHECK', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = '/respondent/1' + PageUrls.RESPONDENT_ADDRESS + InterceptPaths.RESPONDENT_CHANGE;
    request.query = {
      redirect: 'respondent',
    };
    controller.get(request, response);
    expect(request.session.returnUrl).toStrictEqual(PageUrls.RESPONDENT_DETAILS_CHECK);
    expect(response.redirect).toHaveBeenCalledWith('/respondent/1' + PageUrls.RESPONDENT_ADDRESS);
  });

  it('should redirect to the correct respondent page and should set request.session.returnUrl to PageUrls.CheckAnswers', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = '/respondent/1' + PageUrls.RESPONDENT_ADDRESS + InterceptPaths.ANSWERS_CHANGE;
    request.query = {
      redirect: 'answers',
    };
    controller.get(request, response);
    expect(request.session.returnUrl).toStrictEqual(PageUrls.CHECK_ANSWERS);
    expect(response.redirect).toHaveBeenCalledWith('/respondent/1' + PageUrls.RESPONDENT_ADDRESS);
  });

  it('should redirect to the same url with request.url and should set request.session.returnUrl to PageUrls.CheckAnswers', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = PageUrls.DOB_DETAILS + InterceptPaths.ANSWERS_CHANGE;
    request.query = {
      redirect: 'answers',
    };
    controller.get(request, response);
    expect(request.session.returnUrl).toStrictEqual(PageUrls.CHECK_ANSWERS);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.DOB_DETAILS);
  });

  it('should redirect to Error page if invalid query param passed', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = PageUrls.DOB_DETAILS + '/change?redirect=DELETE*FROM DB';
    request.query = {
      redirect: 'DELETE*FROM DB',
    };
    controller.get(request, response);
    expect(response.redirect).toHaveBeenCalledWith(ErrorPages.NOT_FOUND);
  });
});
