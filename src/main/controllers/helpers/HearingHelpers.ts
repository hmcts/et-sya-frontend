import { HearingModel } from '../../definitions/api/caseApiResponse';
import { HearingNotification } from '../../definitions/hearingNotification';

export const setNextListedDate = (hearingCollection: HearingModel[]): HearingNotification => {
  // Check if hearingCollection is not empty
  if (!hearingCollection || hearingCollection.length === 0) {
    return undefined;
  }

  const now = new Date();
  let nextHearing: HearingNotification = undefined;

  // Extract all listed dates from the hearing collection
  hearingCollection.forEach(hearing => {
    if (hearing.value.hearingDateCollection) {
      hearing.value.hearingDateCollection.forEach(dateCollection => {
        const listedDate = new Date(dateCollection.value.listedDate);
        // Check if the listedDate is in the future
        if (listedDate && listedDate > now && (!nextHearing || listedDate < nextHearing.nextHearingDate)) {
          nextHearing = {
            nextHearingDate: listedDate,
            hearingId: hearing.id,
          };
        }
      });
    }
  });

  return nextHearing;
};
