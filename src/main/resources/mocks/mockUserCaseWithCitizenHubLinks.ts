import { CaseState } from '../../definitions/definition';
import { HubLinkNames, HubLinkStatus, HubLinksStatuses } from '../../definitions/hub';

const hubLinksStatuses = new HubLinksStatuses();
Object.keys(hubLinksStatuses).forEach(key => {
  hubLinksStatuses[key] = HubLinkStatus.OPTIONAL;
});

hubLinksStatuses[HubLinkNames.Et1ClaimForm] = HubLinkStatus.SUBMITTED;
hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.WAITING_FOR_TRIBUNAL;
hubLinksStatuses[HubLinkNames.HearingDetails] = HubLinkStatus.NOT_YET_AVAILABLE;
hubLinksStatuses[HubLinkNames.RequestsAndApplications] = HubLinkStatus.VIEWED;
hubLinksStatuses[HubLinkNames.Documents] = HubLinkStatus.COMPLETED;

export default {
  id: '123',
  state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
  ethosCaseReference: '654321/2022',
  firstName: 'Paul',
  lastName: 'Mumbere',
  respondents: [{ respondentNumber: 1, respondentName: 'Itay' }],
  createdDate: 'August 19, 2022',
  lastModified: 'August 19, 2022',
  hubLinksStatuses,
};
