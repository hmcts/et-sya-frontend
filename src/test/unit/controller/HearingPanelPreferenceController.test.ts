import HearingPanelPreferenceController from '../../../main/controllers/HearingPanelPreferenceController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { HearingPanelPreference } from '../../../main/definitions/case';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Panel Preference Controller', () => {
  const t = {
    'hearing-panel-preference': {},
    common: {},
  };

  it('should render the hearing panel preference choice page', () => {
    const controller = new HearingPanelPreferenceController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith('hearing-panel-preference', expect.anything());
  });

  it('should render the same page if errors are present', async () => {
    const errors = [{ propertyName: 'hearingPanelPreferenceReasonJudge', errorType: 'required' }];
    const body = { hearingPanelPreference: HearingPanelPreference.JUDGE };
    const controller = new HearingPanelPreferenceController();

    const req = mockRequest({ body });
    const res = mockResponse();
    await controller.post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(req.path);
    expect(req.session.errors).toEqual(errors);
  });

  it('should clear session data if clearSelection is triggered', () => {
    const controller = new HearingPanelPreferenceController();
    const body = {
      hearingPanelPreference: HearingPanelPreference.JUDGE,
      hearingPanelPreferenceReasonJudge: 'Test comment',
    };
    const response = mockResponse();
    const request = mockRequest({ body });
    request.query = {
      redirect: 'clearSelection',
    };
    controller.get(request, response);
    expect(request.session.userCase.hearingPanelPreference).toStrictEqual(undefined);
    expect(request.session.userCase.hearingPanelPreferenceReasonJudge).toStrictEqual(undefined);
    expect(request.session.userCase.hearingPanelPreferenceReasonPanel).toStrictEqual(undefined);
  });

  it('should add the hearing panel preference form value to the userCase', async () => {
    const body = {
      hearingPanelPreference: HearingPanelPreference.JUDGE,
    };

    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

    const controller = new HearingPanelPreferenceController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      hearingPanelPreference: 'Judge',
      hearingPanelPreferenceReasonPanel: undefined,
    });
  });

  it('should add the hearing panel preference form value to the userCase and have both reasons set to undefined', async () => {
    const body = {
      hearingPanelPreference: HearingPanelPreference.NO_PREFERENCE,
    };

    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

    const controller = new HearingPanelPreferenceController();

    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase).toStrictEqual({
      hearingPanelPreference: 'No preference',
      hearingPanelPreferenceReasonJudge: undefined,
      hearingPanelPreferenceReasonPanel: undefined,
    });
  });
});
