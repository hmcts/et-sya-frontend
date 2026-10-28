import { CaseTypeId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';

import { getFlagValue } from './launchDarkly';

export const CUI_YOUR_SUPPORT_FLAGS: Partial<Record<CaseTypeId, string>> = {
  [CaseTypeId.SCOTLAND]: 'case-flags-v2-enabled-scotland',
  [CaseTypeId.ENGLAND_WALES]: 'case-flags-v2-enabled-england-wales',
};

export class CuiYourSupportFeature {
  // Optional override keeps the feature independently testable; environment instances use LaunchDarkly.
  constructor(private readonly enabledCaseTypeIds?: string[]) {}

  public async isEnabled(caseTypeId?: CaseTypeId | string): Promise<boolean> {
    if (this.enabledCaseTypeIds) {
      return !!caseTypeId && this.enabledCaseTypeIds.includes(caseTypeId);
    }
    const flagKey = CUI_YOUR_SUPPORT_FLAGS[caseTypeId as CaseTypeId];
    return !!flagKey && (await getFlagValue(flagKey, null)) === true;
  }

  public async getSupportPageUrl(caseTypeId?: CaseTypeId | string): Promise<string> {
    return (await this.isEnabled(caseTypeId)) ? PageUrls.YOUR_SUPPORT : PageUrls.REASONABLE_ADJUSTMENTS;
  }
}

export const getCuiYourSupportFeature = (): CuiYourSupportFeature => new CuiYourSupportFeature();
