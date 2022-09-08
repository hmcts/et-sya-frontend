import ChangeDetailsController from '../../../main/controllers/ChangeDetailsController';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Change Details Controller', () => {
  it('should redirect to the same url with request.url and should set request.session.returnUrl to PageUrls.RESPONDENT_DETAILS_CHECK', () => {
    const controller = new ChangeDetailsController();
    const response = mockResponse();
    const request = mockRequest({});
    request.url = PageUrls.RESPONDENT_ADDRESS + '/change';
    controller.get(request, response);
    expect(request.session.returnUrl).toStrictEqual(PageUrls.RESPONDENT_DETAILS_CHECK);
    expect(response.redirect).toHaveBeenCalledWith(PageUrls.RESPONDENT_ADDRESS);
  });
});
