import { HearingModel } from '../../definitions/api/caseApiResponse';

export const setNextListedDate = (hearingCollection: HearingModel[]): Date => {
  // Check if hearingCollection is not empty
  if (!hearingCollection || hearingCollection.length === 0) {
    return undefined;
  }
  const now = new Date();
  let nextListedDate: Date | undefined = undefined;
  // Extract all listed dates from the hearing collection
  hearingCollection.forEach(hearing => {
    if (hearing.value.hearingDateCollection) {
      hearing.value.hearingDateCollection.forEach(dateCollection => {
        const listedDate = new Date(dateCollection.value.listedDate);
        // Check if the listedDate is in the future
        if (listedDate && listedDate > now && (nextListedDate === undefined || listedDate < nextListedDate)) {
          nextListedDate = listedDate;
        }
      });
    }
  });

  return nextListedDate;
};
