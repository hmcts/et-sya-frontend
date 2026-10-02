import HearingPanelPreferenceController from '../../../main/controllers/HearingPanelPreferenceController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { CaseTypeId } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as LaunchDarkly from '../../../main/modules/featureFlag/launchDarkly';
import { mockRequest, mockRequestEmpty } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

describe('Hearing Panel Preference Controller', () => {
  const t = {
    'hearing-panel-preference': {},
    common: {},
  };

  beforeEach(() => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the hearing panel preference page when the ERA feature is enabled', async () => {
    const controller = new HearingPanelPreferenceController();
    const response = mockResponse();
    const request = mockRequest({ t });
    await controller.get(request, response);
    expect(response.render).toHaveBeenCalledWith(TranslationKeys.HEARING_PANEL_PREFERENCE, expect.anything());
  });

  it('should redirect to reasonable adjustments when the ERA feature is disabled', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
    const response = mockResponse();

    await new HearingPanelPreferenceController().get(mockRequest({ t }), response);

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.REASONABLE_ADJUSTMENTS);
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

  it('should redirect to your support when CUI your support is enabled', async () => {
    jest
      .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
      .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
    jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
    const req = mockRequestEmpty({
      body: { claimantHearingPanelPreference: 'No preference' },
      userCase: { caseTypeId: CaseTypeId.SCOTLAND },
    });
    const res = mockResponse();

    await new HearingPanelPreferenceController().post(req, res);

    expect(res.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT);
  });

  it('should not save a hearing-panel preference when the ERA feature is disabled', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
    const req = mockRequestEmpty({
      body: {
        claimantHearingPanelPreference: 'Judge',
        claimantHearingPanelPreferenceWhy: 'Complexity of legal issues',
      },
    });
    const res = mockResponse();

    await new HearingPanelPreferenceController().post(req, res);

    expect(req.session.userCase.claimantHearingPanelPreference).toBeUndefined();
    expect(res.redirect).toHaveBeenCalledWith(PageUrls.REASONABLE_ADJUSTMENTS);
  });

  it('should redirect direct access to your support when ERA is disabled and CUI is enabled', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
    jest
      .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
      .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
    const response = mockResponse();

    await new HearingPanelPreferenceController().get(
      mockRequest({ t, userCase: { caseTypeId: CaseTypeId.SCOTLAND } }),
      response
    );

    expect(response.redirect).toHaveBeenCalledWith(PageUrls.YOUR_SUPPORT);
  });
});
