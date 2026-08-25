import config from 'config';

import { CaseTypeId } from '../../definitions/case';
import { PageUrls } from '../../definitions/constants';

const ENABLED_CASE_TYPE_IDS_CONFIG = 'featureFlags.cuiYourSupport.enabledCaseTypeIds';

const parseEnabledCaseTypeIds = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .filter((caseTypeId): caseTypeId is string => typeof caseTypeId === 'string' && !!caseTypeId.trim())
      .map(caseTypeId => caseTypeId.trim());
  }

  if (typeof value !== 'string' || !value.trim()) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(value);
    if (Array.isArray(parsedValue)) {
      return parseEnabledCaseTypeIds(parsedValue);
    }
  } catch {
    // Comma-separated environment overrides are also supported.
  }

  return value
    .split(',')
    .map(caseTypeId => caseTypeId.trim())
    .filter(Boolean);
};

const getConfiguredEnabledCaseTypeIds = (): string[] => {
  if (!config.has(ENABLED_CASE_TYPE_IDS_CONFIG)) {
    return [];
  }

  return parseEnabledCaseTypeIds(config.get(ENABLED_CASE_TYPE_IDS_CONFIG));
};

export class CuiYourSupportFeature {
  constructor(private readonly enabledCaseTypeIds: string[] = getConfiguredEnabledCaseTypeIds()) {}

  public isEnabled(caseTypeId?: CaseTypeId | string): boolean {
    return !!caseTypeId && this.enabledCaseTypeIds.includes(caseTypeId);
  }

  public getSupportPageUrl(caseTypeId?: CaseTypeId | string): string {
    return this.isEnabled(caseTypeId) ? PageUrls.YOUR_SUPPORT : PageUrls.REASONABLE_ADJUSTMENTS;
  }
}

export const getCuiYourSupportFeature = (): CuiYourSupportFeature => new CuiYourSupportFeature();
