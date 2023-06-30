import { YesOrNo } from '../../definitions/case';
import { GenericTseApplicationTypeItem } from '../../definitions/complexTypes/genericTseApplicationTypeItem';
import { HubLinkStatus } from '../../definitions/hub';

export const getNewApplicationStatus = (selectedApplication: GenericTseApplicationTypeItem): HubLinkStatus => {
  const currentStatus = selectedApplication.value.applicationState;
  let newStatus;
  switch (currentStatus) {
    case HubLinkStatus.NOT_VIEWED:
      newStatus = HubLinkStatus.VIEWED;
      break;
    case HubLinkStatus.UPDATED:
      if (
        selectedApplication.value.applicant === 'Claimant' &&
        selectedApplication.value.respondentResponseRequired === undefined
      ) {
        newStatus = HubLinkStatus.WAITING_FOR_TRIBUNAL;
        break;
      }
      newStatus = HubLinkStatus.IN_PROGRESS;
      break;
    case HubLinkStatus.NOT_STARTED_YET:
      if (YesOrNo.YES !== selectedApplication.value.claimantResponseRequired) {
        newStatus = HubLinkStatus.IN_PROGRESS;
      }
      break;
    default:
  }
  return newStatus;
};
