import { HearingDateCollection, HearingModel } from '../../definitions/api/caseApiResponse';
import { SummaryListRow, addSummaryRow } from '../../definitions/govuk/govukSummaryList';
import { HearingNotification } from '../../definitions/hearingNotification';
import { AnyRecord } from '../../definitions/util-types';

export const setNextListedDate = (hearingCollection: HearingModel[]): HearingNotification => {
  // Check if hearingCollection is not empty
  if (!hearingCollection || hearingCollection.length === 0) {
    return undefined;
  }

  const now = new Date();
  const nextHearing: HearingNotification | undefined = undefined;

  // Extract all listed dates from the hearing collection
  hearingCollection.forEach(hearing => {
    if (hearing.value.hearingDateCollection) {
      hearing.value.hearingDateCollection.forEach(dateCollection => {
        const listedDate = new Date(dateCollection.value.listedDate);
        // Check if the listedDate is in the future
        if (
          listedDate &&
          listedDate > now &&
          (nextHearing.nextHearingDate === undefined || listedDate < nextHearing.nextHearingDate)
        ) {
          nextHearing.nextHearingDate = listedDate;
          nextHearing.hearingId = hearing.id;
        }
      });
    }
  });

  return nextHearing;
};

export const getHearingModelWithEarliestDate = (hearingModels: HearingModel[]): HearingModel => {
  let earliestHearingModel: HearingModel | undefined;
  let earliestDate: Date | null = null;

  hearingModels.forEach(hearing => {
    const earliestHearing = getEarliestFutureHearing(hearing.value.hearingDateCollection);

    if (earliestHearing) {
      const listedDate = earliestHearing.value.listedDate;
      if (!earliestDate || listedDate < earliestDate) {
        earliestDate = listedDate;
        earliestHearingModel = hearing;
      }
    }
  });

  return earliestHearingModel;
};

export const getEarliestFutureHearing = (hearingDateCollection: HearingDateCollection[]): HearingDateCollection => {
  // Get current date
  const currentDate = new Date();

  // Filter dates in the future
  const futureDates = hearingDateCollection.filter(hearing => hearing.value.listedDate > currentDate);

  // Find the earliest date
  let earliestDate: Date | null = null;
  let earliestHearing: HearingDateCollection | undefined;

  futureDates.forEach(hearing => {
    if (!earliestDate || hearing.value.listedDate < earliestDate) {
      earliestDate = hearing.value.listedDate;
      earliestHearing = hearing;
    }
  });

  return earliestHearing;
};

export const getHearingDetails = (hearingCollection: HearingModel[], translations: AnyRecord): SummaryListRow[] => {
  const rows: SummaryListRow[] = [];
  hearingCollection.forEach(h => rows.push(...getFromEachHearingCollection(h, translations)));
  return rows;
};

const getFromEachHearingCollection = (hearingModel: HearingModel, translations: AnyRecord): SummaryListRow[] => {
  const hearing = hearingModel.value;
  const rows: SummaryListRow[] = [];
  rows.push(addSummaryRow(translations.hearingType, hearing.Hearing_type));
  rows.push(addSummaryRow(translations.hearingVenue, hearing.Hearing_venue.value.label));
  rows.push(addSummaryRow(translations.hearingFormat, hearing.hearingFormat.join(', ')));
  rows.push(addSummaryRow(translations.hearingPublicPrivate, hearing.hearingPublicPrivate));
  rows.push(addSummaryRow(translations.hearingNumber, hearing.hearingNumber));
  rows.push(addSummaryRow(translations.hearingEstLengthNum, hearing.hearingEstLengthNum));
  rows.push(addSummaryRow(translations.hearingEstLengthNumType, hearing.hearingEstLengthNum));
  rows.push(addSummaryRow(translations.hearingSitAlone, hearing.hearingSitAlone));
  rows.push(addSummaryRow(translations.judge, hearing.Hearing_judge_name));
  return rows;
};
