import { YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { Applicant } from '../../definitions/constants';
import { HubLinkStatus } from '../../definitions/hub';

/**
 * Using the current state, checks if viewing an application should change its state
 */
export const getNewApplicationStatus = (selectedApplication: GenericTseApplicationTypeItem): HubLinkStatus => {
  let newState;
  switch (selectedApplication.value.applicationState) {
    case HubLinkStatus.NOT_VIEWED:
      newState = HubLinkStatus.VIEWED;
      break;
    case HubLinkStatus.UPDATED:
      if (
        selectedApplication.value.applicant === Applicant.CLAIMANT &&
        selectedApplication.value.respondentResponseRequired === undefined
      ) {
        newState = HubLinkStatus.WAITING_FOR_TRIBUNAL;
        break;
      }
      newState = HubLinkStatus.IN_PROGRESS;
      break;
    case HubLinkStatus.NOT_STARTED_YET:
      if (YesOrNo.YES !== selectedApplication.value.claimantResponseRequired) {
        newState = HubLinkStatus.IN_PROGRESS;
      }
      break;
    default:
  }
  return newState;
};
