import { CaseWithId } from '../../definitions/case';
import { CaseState } from '../../definitions/definition';
import { ProgressBarItem, addProgressBarItem } from '../../definitions/govuk/hmctsProgressBar';
import { AnyRecord } from '../../definitions/util-types';
import { datesStringToDateInLocale } from '../../helper/dateInLocale';

import { isHearingExist } from './HearingHelpers';

export const getProgressBarItems = (
  userCase: Partial<CaseWithId>,
  translations: AnyRecord,
  url: string
): ProgressBarItem[] => {
  const progressBarItems: ProgressBarItem[] = [
    addProgressBarItem(translations.accepted, userCase.state === CaseState.ACCEPTED, false),
    addProgressBarItem(getResponseReceivedText(userCase, translations, url), userCase.et3ResponseReceived, false),
    addProgressBarItem(translations.details, isHearingExist(userCase.hearingCollection), false),
    addProgressBarItem(translations.decision, false, false),
  ];

  setCurrentStage(progressBarItems);

  return progressBarItems;
};

/**
 * The case is at the furthest stage it has reached, so the last completed spot is the current one:
 * shown green and in bold, with the spots before it staying green in standard text. A stage the case
 * has passed without completing - a hearing listed before the response is received - stays empty.
 */
const setCurrentStage = (progressBarItems: ProgressBarItem[]): void => {
  const lastCompleteIndex = progressBarItems.map(item => !!item.complete).lastIndexOf(true);
  // Nothing is complete until the claim is accepted, so the first stage is the one being worked towards
  progressBarItems[lastCompleteIndex === -1 ? 0 : lastCompleteIndex].active = true;
};

const getResponseReceivedText = (userCase: Partial<CaseWithId>, translations: AnyRecord, url: string): string => {
  if (userCase.et3ResponseReceived) {
    return translations.received;
  } else if (userCase.et3DueDate) {
    return translations.responseDue + ' ' + datesStringToDateInLocale(userCase.et3DueDate, url);
  } else {
    return translations.responseDue;
  }
};
