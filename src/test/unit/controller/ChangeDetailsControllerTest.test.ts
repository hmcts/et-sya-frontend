import ChangeDetailsController from '../../../main/controllers/ChangeDetailsController';
import { InterceptPaths, PageUrls, languages } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Change Details Controller', () => {
  it('should redirect to the same url with request.url and should set request.session.returnUrl to PageUrls.RESPONDENT_DETAILS_CHECK', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = PageUrls.RESPONDENT_ADDRESS + InterceptPaths.RESPONDENT_CHANGE;
    request.query = {
      redirect: 'respondent',
    };
    controller.get(request, response);
    expect(request.session.returnUrl).toStrictEqual(PageUrls.RESPONDENT_DETAILS_CHECK);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_ADDRESS + languages.ENGLISH_URL_PARAMETER);
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
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.DOB_DETAILS + languages.ENGLISH_URL_PARAMETER);
  });
});
