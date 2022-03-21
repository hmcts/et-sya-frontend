import UpdatePreferenceController from '../../../main/controllers/UpdatePreferenceController';
import { AppRequest } from '../../../main/definitions/appRequest';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Update Preference Controller', () => {
  const t = {
    'update-preference': {},
    common: {},
  };

  it('should render the Update Preference page', () => {
    const controller = new UpdatePreferenceController();
    const response = mockResponse();
    const request = <AppRequest>mockRequest({ t });

    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.UPDATE_PREFERENCE, expect.anything());
  });

  it('should redirect to the same screen when errors are present', () => {
    const errors = [{ propertyName: 'updatePreference', errorType: 'required' }];
    const body = { updatePreference: '' };

    const controller = new UpdatePreferenceController();

    const req = mockRequest({ body });
    const res = mockResponse();
    controller.post(req, res);

    expect(res.redirect).toBeCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });
});
