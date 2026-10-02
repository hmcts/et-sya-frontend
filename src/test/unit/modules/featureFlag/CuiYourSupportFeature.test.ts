import { CaseTypeId } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../../../main/modules/featureFlag/CuiYourSupportFeature';
import * as LaunchDarkly from '../../../../main/modules/featureFlag/launchDarkly';

describe('CuiYourSupportFeature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
  });

  it('uses the Scotland flag for Scotland cases', async () => {
    const feature = new CuiYourSupportFeature();

    await expect(feature.isEnabled(CaseTypeId.SCOTLAND)).resolves.toBe(false);
    expect(LaunchDarkly.getFlagValue).toHaveBeenCalledWith('case-flags-v2-enabled-scotland', null);
  });

  it('uses the England and Wales flag for England and Wales cases', async () => {
    const feature = new CuiYourSupportFeature();

    await expect(feature.isEnabled(CaseTypeId.ENGLAND_WALES)).resolves.toBe(false);
    expect(LaunchDarkly.getFlagValue).toHaveBeenCalledWith('case-flags-v2-enabled-england-wales', null);
  });

  it('disables missing or unknown case types without evaluating a LaunchDarkly flag', async () => {
    const feature = new CuiYourSupportFeature();

    await expect(feature.isEnabled()).resolves.toBe(false);
    await expect(feature.isEnabled('unknown-case-type')).resolves.toBe(false);
    expect(LaunchDarkly.getFlagValue).not.toHaveBeenCalled();
  });

  it('returns the CUI support URL only when the relevant flag is enabled', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    const feature = new CuiYourSupportFeature();

    await expect(feature.getSupportPageUrl(CaseTypeId.SCOTLAND)).resolves.toBe(PageUrls.YOUR_SUPPORT);
    await expect(feature.getSupportPageUrl(CaseTypeId.ENGLAND_WALES)).resolves.toBe(PageUrls.REASONABLE_ADJUSTMENTS);
  });

  it('returns the CUI support URL for both case types when both LaunchDarkly flags are enabled', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(true);
    const feature = new CuiYourSupportFeature();

    await expect(feature.getSupportPageUrl(CaseTypeId.SCOTLAND)).resolves.toBe(PageUrls.YOUR_SUPPORT);
    await expect(feature.getSupportPageUrl(CaseTypeId.ENGLAND_WALES)).resolves.toBe(PageUrls.YOUR_SUPPORT);
  });

  it('returns the RA URL for both case types when both LaunchDarkly flags are disabled', async () => {
    jest.spyOn(LaunchDarkly, 'getFlagValue').mockResolvedValue(false);
    const feature = new CuiYourSupportFeature();

    await expect(feature.getSupportPageUrl(CaseTypeId.SCOTLAND)).resolves.toBe(PageUrls.REASONABLE_ADJUSTMENTS);
    await expect(feature.getSupportPageUrl(CaseTypeId.ENGLAND_WALES)).resolves.toBe(PageUrls.REASONABLE_ADJUSTMENTS);
  });
});
