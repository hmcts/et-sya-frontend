import ReturnToExistingController from '../../../main/controllers/ReturnToExistingController';
import { getLanguageParam, returnValidUrl } from '../../../main/controllers/helpers/RouterHelpers';
import { YesOrNo } from '../../../main/definitions/case';
import { LegacyUrls, PageUrls } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Return To Existing Controller', () => {
  const t = {
    'return-to-claim': {},
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
    expect(res.redirect).toHaveBeenCalledWith(returnValidUrl(req.path, Object.values(PageUrls)));
    expect(req.session.errors).toEqual(errors);
  });

  it('should redirect to home if no errors', () => {
    const body = { returnToExisting: YesOrNo.YES };
    const controller = new ReturnToExistingController();

    const req = mockRequest({ body });
    const res = mockResponse();

    controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(LegacyUrls.ET1_BASE);
    expect(req.session.errors).toHaveLength(0);
  });

  it('should pass startNewClaimUrl to the view', () => {
    const controller = new ReturnToExistingController();
    const response = mockResponse();
    const request = mockRequest({ t });

    controller.get(request, response);

    expect(response.render).toHaveBeenCalledWith(
      'return-to-claim',
      expect.objectContaining({
        startNewClaimUrl: PageUrls.CHECKLIST + getLanguageParam(request.url),
      })
    );
  });
});
