import { CaseTypeId } from '../../../../main/definitions/case';
import { PageUrls } from '../../../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../../../main/modules/featureFlag/CuiYourSupportFeature';

describe('CuiYourSupportFeature', () => {
  it('should disable CUI your support when no case type ids are configured', () => {
    const feature = new CuiYourSupportFeature([]);

    expect(feature.isEnabled(CaseTypeId.SCOTLAND)).toBe(false);
    expect(feature.isEnabled(CaseTypeId.ENGLAND_WALES)).toBe(false);
  });

  it('should enable CUI your support only for configured case type ids', () => {
    const feature = new CuiYourSupportFeature([CaseTypeId.SCOTLAND]);

    expect(feature.isEnabled(CaseTypeId.SCOTLAND)).toBe(true);
    expect(feature.isEnabled(CaseTypeId.ENGLAND_WALES)).toBe(false);
  });

  it('should return the support page for the configured case type', () => {
    const feature = new CuiYourSupportFeature([CaseTypeId.SCOTLAND]);

    expect(feature.getSupportPageUrl(CaseTypeId.SCOTLAND)).toBe(PageUrls.YOUR_SUPPORT);
    expect(feature.getSupportPageUrl(CaseTypeId.ENGLAND_WALES)).toBe(PageUrls.REASONABLE_ADJUSTMENTS);
  });
});
