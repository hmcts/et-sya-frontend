import { HearingDateCollection, HearingModel } from '../../definitions/api/caseApiResponse';
import { HearingStatus } from '../../definitions/hearing';

export const isHearingExist = (hearingCollection: HearingModel[]): boolean => {
  return hearingCollection && hearingCollection.length > 0;
};

export const shouldShowHearingInFuture = (hearingCollection: HearingModel[]): boolean => {
  return hearingCollection?.some(hearing => isHearingCollectionInFuture(hearing)) || false;
};

const isHearingCollectionInFuture = (hearing: HearingModel): boolean => {
  return hearing.value.hearingDateCollection?.some(dateItem => isListedDateInFuture(dateItem)) || false;
};

const isListedDateInFuture = (dateItem: HearingDateCollection): boolean => {
  return dateItem.value.Hearing_status === HearingStatus.LISTED && new Date(dateItem.value.listedDate) > new Date();
};
