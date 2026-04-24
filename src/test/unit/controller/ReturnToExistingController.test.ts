import ReturnToExistingController from '../../../main/controllers/ReturnToExistingController';
import { ReturnToExistingOption } from '../../../main/definitions/case';
import { LegacyUrls, PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Return To Existing Controller', () => {
  const t = {
    'return-to-existing': {},
    common: {},
  };

  it('should render the return to claim page', () => {
    const controller = new ReturnToExistingController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith('return-to-claim', expect.anything());
  });

  it('should redirect back to self if there are errors', () => {
    const errors = [{ propertyName: 'returnToExisting', errorType: 'required' }];
    const body = { returnToExisting: '' };
    const controller = new ReturnToExistingController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);
    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to claimant applications when draft claim and user has an account', () => {
    const body = {
      returnToExisting: ReturnToExistingOption.DRAFT_CLAIM,
      draftClaimOption: ReturnToExistingOption.HAVE_ACCOUNT,
    };
    const controller = new ReturnToExistingController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    expect(req.session.errors).toHaveLength(0);
  });

  it('should redirect to legacy ET1 sign-in when draft claim and user has a save and return number', () => {
    const body = {
      returnToExisting: ReturnToExistingOption.DRAFT_CLAIM,
      draftClaimOption: ReturnToExistingOption.RETURN_NUMBER,
    };
    const controller = new ReturnToExistingController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(`${LegacyUrls.ET1_BASE}${LegacyUrls.ET1_SIGN_IN}`);
    expect(req.session.errors).toHaveLength(0);
  });

  it('should redirect to claimant applications when submitted claim and user has an account', () => {
    const body = {
      returnToExisting: ReturnToExistingOption.SUBMITTED_CLAIM,
      submittedClaimOption: ReturnToExistingOption.HAVE_ACCOUNT,
    };
    const controller = new ReturnToExistingController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    expect(req.session.errors).toHaveLength(0);
  });

  it('should redirect to case number check when submitted claim and user has no account', () => {
    const body = {
      returnToExisting: ReturnToExistingOption.SUBMITTED_CLAIM,
      submittedClaimOption: ReturnToExistingOption.CLAIM_BUT_NO_ACCOUNT,
    };
    const controller = new ReturnToExistingController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.CASE_NUMBER_CHECK);
    expect(req.session.visitedAssignClaimFlow).toBe(true);
    expect(req.session.errors).toHaveLength(0);
  });

  it('should render page content without startNewClaimUrl', () => {
    const controller = new ReturnToExistingController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      'return-to-claim',
      expect.not.objectContaining({
        startNewClaimUrl: expect.anything(),
      })
    );
  });
});
