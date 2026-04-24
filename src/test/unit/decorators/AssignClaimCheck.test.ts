import { checkAssignClaimAndRedirect } from '../../../main/decorators/AssignClaimCheck';
import { AppRequest } from '../../../main/definitions/appRequest';
import { PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('AssignClaimCheck', () => {
  it('should redirect to CLAIMANT_APPLICATIONS if visitedAssignClaimFlow is false and user is logged in', () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.session.visitedAssignClaimFlow = false;
    req.session.user = {
      id: '123',
      email: 'test@test.com',
      accessToken: 'test',
      givenName: 'test',
      familyName: 'test',
      isCitizen: true,
    };

    const result = checkAssignClaimAndRedirect(req as AppRequest, res);

    expect(result).toBe(true);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS + '?lng=en');
  });

  it('should redirect to RETURN_TO_EXISTING if visitedAssignClaimFlow is false and user is not logged in', () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.session.visitedAssignClaimFlow = false;
    req.session.user = undefined;

    const result = checkAssignClaimAndRedirect(req as AppRequest, res);

    expect(result).toBe(true);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.RETURN_TO_EXISTING + '?lng=en');
  });

  it('should redirect to CASE_NUMBER_CHECK if accessing YOUR_DETAILS_FORM without caseNumberVerified', () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.session.visitedAssignClaimFlow = true;
    req.session.caseNumberChecked = false;
    req.url = PageUrls.YOUR_DETAILS_FORM;

    const result = checkAssignClaimAndRedirect(req as AppRequest, res);

    expect(result).toBe(true);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_NUMBER_CHECK + '?lng=en');
  });

  it('should redirect to YOUR_DETAILS_FORM if accessing YOUR_DETAILS_CYA without yourDetailsVerified', () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.session.visitedAssignClaimFlow = true;
    req.session.yourDetailsVerified = false;
    req.url = PageUrls.YOUR_DETAILS_CYA;

    const result = checkAssignClaimAndRedirect(req as AppRequest, res);

    expect(result).toBe(true);
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_DETAILS_FORM + '?lng=en');
  });

  it('should return false if all checks pass', () => {
    const req = mockRequest({});
    const res = mockResponse();
    req.session.visitedAssignClaimFlow = true;
    req.session.caseNumberChecked = true;
    req.session.yourDetailsVerified = true;
    req.url = PageUrls.YOUR_DETAILS_CYA;

    const result = checkAssignClaimAndRedirect(req as AppRequest, res);

    expect(result).toBe(false);
    expect(res.redirect).not.toHaveBeenCalled();
  });
});
