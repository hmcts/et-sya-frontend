import ChangeDetailsController from '../../../main/controllers/ChangeDetailsController';
import { CaseWithId } from '../../../main/definitions/case';
import { ErrorPages, InterceptPaths, PageUrls, languages } from '../../../main/definitions/constants';
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
    expect(request.session.returnUrl).toStrictEqual(
      PageUrls.RESPONDENT_DETAILS_CHECK + languages.ENGLISH_URL_PARAMETER
    );
    expect(response.redirect).toHaveBeenCalledWith(
      '/respondent/1' + PageUrls.RESPONDENT_ADDRESS + languages.ENGLISH_URL_PARAMETER
    );
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
    expect(request.session.returnUrl).toStrictEqual(PageUrls.CHECK_ANSWERS + languages.ENGLISH_URL_PARAMETER);
    expect(response.redirect).toHaveBeenCalledWith(
      '/respondent/1' + PageUrls.RESPONDENT_ADDRESS + languages.ENGLISH_URL_PARAMETER
    );
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
    expect(request.session.returnUrl).toStrictEqual(PageUrls.CHECK_ANSWERS + languages.ENGLISH_URL_PARAMETER);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.DOB_DETAILS + languages.ENGLISH_URL_PARAMETER);
  });

  it('should redirect to the correct page and set returnUrl to CLAIMANT_REP_CHECK_ANSWERS for rep-answers', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = PageUrls.DOB_DETAILS + InterceptPaths.REP_ANSWERS_CHANGE;
    request.query = {
      redirect: 'rep-answers',
    };
    controller.get(request, response);
    expect(request.session.returnUrl).toStrictEqual(
      PageUrls.CLAIMANT_REP_CHECK_ANSWERS + languages.ENGLISH_URL_PARAMETER
    );
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.DOB_DETAILS + languages.ENGLISH_URL_PARAMETER);
  });

  it('should redirect and set repAboutYouCaseId from url when session case is missing', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const caseId = 'a4396b10-6928-4711-a3ba-89fcf6adb779';
    const request = mockRequest({});
    request.session.userCase = undefined;
    request.url = PageUrls.CLAIMANT_REP_EDIT_NAME.replace(':caseId', caseId) + InterceptPaths.REP_ABOUT_YOU_CHANGE;
    request.query = {
      redirect: 'rep-about-you',
    };
    controller.get(request, response);
    expect(request.session.repAboutYouCaseId).toBe(caseId);
    expect(response.redirect).toHaveBeenCalledWith(
      PageUrls.CLAIMANT_REP_EDIT_NAME.replace(':caseId', caseId) + languages.ENGLISH_URL_PARAMETER
    );
  });

  it('should redirect and set repAboutYouCaseId for rep-about-you', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const caseId = 'a4396b10-6928-4711-a3ba-89fcf6adb779';
    const request = mockRequest({});
    request.session.userCase = { id: caseId } as unknown as CaseWithId;
    request.url = PageUrls.CLAIMANT_REP_EDIT_NAME.replace(':caseId', caseId) + InterceptPaths.REP_ABOUT_YOU_CHANGE;
    request.query = {
      redirect: 'rep-about-you',
    };
    controller.get(request, response);
    expect(request.session.repAboutYouCaseId).toBe(caseId);
    expect(request.session.returnUrl).toBeUndefined();
    expect(response.redirect).toHaveBeenCalledWith(
      PageUrls.CLAIMANT_REP_EDIT_NAME.replace(':caseId', caseId) + languages.ENGLISH_URL_PARAMETER
    );
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
