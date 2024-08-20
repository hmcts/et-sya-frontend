import { CaseWithId } from '../../definitions/case';
import { CaseState } from '../../definitions/definition';
import { ProgressBarItem, addProgressBarItem } from '../../definitions/govuk/hmctsProgressBar';
import { AnyRecord } from '../../definitions/util-types';

import { isHearingExist } from './HearingHelpers';

const enum ActiveState {
  ACCEPTED = 'accepted',
  RECEIVED = 'received',
  HEARING = 'details',
  DECISION = 'decision',
}

export const getProgressBarItems = (userCase: Partial<CaseWithId>, translations: AnyRecord): ProgressBarItem[] => {
  const progressBarItem: ProgressBarItem[] = [];

  const activeState = getActiveState(userCase);

  progressBarItem.push(
    addProgressBarItem(
      translations.accepted,
      userCase.state === CaseState.ACCEPTED,
      activeState === ActiveState.ACCEPTED
    )
  );

  progressBarItem.push(
    addProgressBarItem(translations.received, userCase.et3ResponseReceived, activeState === ActiveState.RECEIVED)
  );

  progressBarItem.push(
    addProgressBarItem(
      translations.details,
      isHearingExist(userCase.hearingCollection),
      activeState === ActiveState.HEARING
    )
  );

  progressBarItem.push(addProgressBarItem(translations.decision, false, activeState === ActiveState.DECISION));

  return progressBarItem;
};

const getActiveState = (userCase: Partial<CaseWithId>): string => {
  if (isHearingExist(userCase.hearingCollection)) {
    return ActiveState.HEARING;
  } else if (userCase.et3ResponseReceived) {
    return ActiveState.RECEIVED;
  } else if (userCase.state === CaseState.ACCEPTED) {
    return ActiveState.ACCEPTED;
  }
};
