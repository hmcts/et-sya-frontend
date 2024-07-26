import { HearingModel } from '../../definitions/api/caseApiResponse';

export const isHearingExist = (hearingCollection: HearingModel[]): boolean => {
  return hearingCollection && hearingCollection.length > 0;
};
