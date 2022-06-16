import PastEmployerController from '../../../main/controllers/PastEmployerController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { TypesOfClaim } from '../../../main/definitions/definition';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Update Past Employer Controller', () => {
  const t = {
    'past-employer': {},
    common: {},
  };

  it('should render the Update Preference page', () => {
    const userCase = {
      typeOfClaim: [
        TypesOfClaim.BREACH_OF_CONTRACT,
        TypesOfClaim.DISCRIMINATION,
        TypesOfClaim.OTHER_TYPES,
        TypesOfClaim.PAY_RELATED_CLAIM,
      ],
    };
    const controller = new PastEmployerController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t, userCase });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('past-employer', expect.anything());
  });

  it('should render still working for employer when session contains unfairDismissal type of claim', () => {
    const userCase = {
      typeOfClaim: [TypesOfClaim.UNFAIR_DISMISSAL],
    };
    const controller = new PastEmployerController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t, userCase });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('still-working', expect.anything());
    // expect(response.req).toHaveBeenCalledWith(TranslationKeys.STILL_WORKING, {});
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'pastEmployer', errorType: 'required' }];
    const body = { pastEmployer: '' };

    const controller = new PastEmployerController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
