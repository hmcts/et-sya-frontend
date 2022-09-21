import { PageUrls } from '../../definitions/constants';
import { CaseState } from '../../definitions/definition';
import { HubLinkNames, HubLinkStatus, HubLinks } from '../../definitions/hub';

const hubLinks = new HubLinks();
Object.keys(hubLinks).forEach(key => {
  hubLinks[key] = {
    link: PageUrls.HOME,
    status: HubLinkStatus.OPTIONAL,
  };
});

hubLinks[HubLinkNames.PersonalDetails].status = HubLinkStatus.SUBMITTED;
hubLinks[HubLinkNames.Et1ClaimForm].status = HubLinkStatus.SUBMITTED;
hubLinks[HubLinkNames.RespondentResponse].status = HubLinkStatus.COMPLETED;
hubLinks[HubLinkNames.HearingDetails].status = HubLinkStatus.NOT_YET_AVAILABLE;
hubLinks[HubLinkNames.RequestsAndApplications].status = HubLinkStatus.VIEWED;

export default {
  id: '123',
  state: CaseState.AWAITING_SUBMISSION_TO_HMCTS,
  ethosCaseReference: '654321/2022',
  firstName: 'Paul',
  lastName: 'Mumbere',
  respondents: [{ respondentNumber: 1, respondentName: 'Itay' }],
  createdDate: 'August 19, 2022',
  lastModified: 'August 19, 2022',
  hubLinks,
};
