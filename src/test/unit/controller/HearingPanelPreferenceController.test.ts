import HearingPanelPreferenceController from '../../../main/controllers/HearingPanelPreferenceController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Panel Preference Controller', () => {
  const t = {
    'hearing-panel-preference': {},
    common: {},
  };

  it('should render the hearing panel preference page', () => {
    const controller = new HearingPanelPreferenceController();
    const response = mockResponse();
    const request = mockRequest({ t });
    controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.HEARING_PANEL_PREFERENCE, expect.anything());
  });

  it('should save claimantHearingPanelPreference to userCase and redirect to reasonable adjustments', async () => {
    const body = {
      claimantHearingPanelPreference: 'Judge',
      claimantHearingPanelPreferenceWhy: 'Complexity of legal issues',
    };

    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

    const controller = new HearingPanelPreferenceController();
    const req = mockRequestEmpty({ body });
    const res = mockResponse();

    await controller.post(req, res);

    expect(req.session.userCase.claimantHearingPanelPreference).toBe('Judge');
    expect(req.session.userCase.claimantHearingPanelPreferenceWhy).toBe('Complexity of legal issues');
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.REASONABLE_ADJUSTMENTS);
  });
});
