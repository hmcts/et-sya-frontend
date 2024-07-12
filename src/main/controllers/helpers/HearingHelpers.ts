import { HearingDateCollection, HearingModel } from '../../definitions/api/caseApiResponse';

/**
 * getEarliestFutureHearingDate
 * @param hearingList
 */
export const getEarliestFutureHearingDateCollection = (hearingList: HearingModel[]): HearingDateCollection => {
  const dateList = hearingList.map(h => getFutureHearingDateCollection(h));
  if (dateList.length === 0) {
    return;
  }
  return dateList.reduce((a, b) => (new Date(a.value.listedDate) > new Date(b.value.listedDate) ? b : a));
};

/**
 * getFutureHearingDateCollection
 * @param hearing
 */
export const getFutureHearingDateCollection = (hearing: HearingModel): HearingDateCollection => {
  // filter out hearings with dates in the past
  // hearings can have multiple dates set so reduce to find the earliest date set for that particular hearing
  const hearingsInFuture = hearing.value.hearingDateCollection.filter(
    item => new Date(item.value.listedDate) > new Date()
  );

  if (!hearingsInFuture.length) {
    return;
  }

  return hearingsInFuture.reduce((a, b) => (new Date(a.value.listedDate) > new Date(b.value.listedDate) ? b : a));
};

/**
 * formatDate
 * @param rawDate
 */
export const formatDate = (rawDate: Date): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(rawDate));
