import { getMultiplePanelData } from '../../../../../main/controllers/helpers/multiples/MultiplePanelHelper';
import { YesOrNo } from '../../../../../main/definitions/case';
import { TranslationKeys } from '../../../../../main/definitions/constants';
import { AnyRecord } from '../../../../../main/definitions/util-types';
import * as LaunchDarkly from '../../../../../main/modules/featureFlag/launchDarkly';
import citizenHub from '../../../../../main/resources/locales/en/translation/citizen-hub.json';
import common from '../../../../../main/resources/locales/en/translation/common.json';
import { mockRequestWithTranslation } from '../../../mocks/mockRequest';
import mockUserCaseComplete from '../../../mocks/mockUserCaseComplete';

describe('Multiple Panel tests', () => {
  const userCase = mockUserCaseComplete;
  const translationJson = { ...citizenHub, ...common };
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  const req = mockRequestWithTranslation({}, translationJson);
  const translations: AnyRecord = {
    ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
  };

  it('returns data when multiple and lead claimant is true and feature flag is true', async () => {
    const result = await getMultiplePanelData(userCase, translations);
    expect(result.banner).toEqual('LEAD CLAIM');
    expect(result.text).toEqual('Your individual case is designated the lead case in a group claim.');
  });

  it('returns data when multiple Flag is true, lead claimant is false and feature flag is true', async () => {
    userCase.leadClaimant = YesOrNo.NO;
    const result = await getMultiplePanelData(userCase, translations);
    expect(result.banner).toEqual('CASE STAYED');
    expect(result.text).toEqual(
      'Your individual claim is stayed. The group claim will progress and you can view updates on the group claim.'
    );
  });

  it('returns undefined when multiple flag is false and feature flag is true', async () => {
    userCase.multipleFlag = YesOrNo.NO;
    const result = await getMultiplePanelData(userCase, translations);
    expect(result).toBeUndefined();
  });

  it('returns undefined when multiple and lead claimant is true and feature flag is false', async () => {
    mockLdClient.mockResolvedValue(false);
    const result = await getMultiplePanelData(userCase, translations);
    expect(result).toBeUndefined();
  });
});
