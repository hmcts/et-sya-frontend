import { HearingModel } from '../../definitions/api/caseApiResponse';

/**
 * Check if any Hearing exist in hearingCollection
 * @param hearingModel Hearing Collection for the case
 */
export const isHearingExist = (hearingModel: HearingModel[]): boolean => {
  return hearingModel && hearingModel.length > 0;
};
