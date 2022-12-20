import UpdatePreferenceController from '../../../main/controllers/UpdatePreferenceController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { AppRequest } from '../../../main/definitions/appRequest';
import { TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
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

  it('should redirect to the same screen when errors are present', async () => {
    const errors = [{ propertyName: 'claimantContactPreference', errorType: 'required' }];
    const body = { claimantContactPreference: '' };

    const controller = new UpdatePreferenceController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should add the update preference form value to the userCase', async () => {
    const body = { claimantContactPreference: 'Email' };
    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

    const controller = new UpdatePreferenceController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({ claimantContactPreference: 'Email' });
  });
});
