import { PageUrls } from './constants';

export enum HubLinkNames {
  PersonalDetails = 'personalDetails',
  Et1ClaimForm = 'et1ClaimForm',
  RespondentResponse = 'respondentResponse',
  HearingDetails = 'hearingDetails',
  RequestsAndApplications = 'requestsAndApplications',
  RespondentApplications = 'respondentApplications',
  ContactTribunal = 'contactTribunal',
  TribunalOrders = 'tribunalOrders',
  TribunalJudgements = 'tribunalJudgements',
  Documents = 'documents',
}

export class HubLinksStatuses {
  [linkName: string]: HubLinkStatus;

  constructor() {
    Object.values(HubLinkNames).forEach(name => {
      this[name] = HubLinkStatus.NOT_YET_AVAILABLE;
    });

    this[HubLinkNames.Et1ClaimForm] = HubLinkStatus.SUBMITTED;
    this[HubLinkNames.ContactTribunal] = HubLinkStatus.OPTIONAL;
  }
}

export const enum HubLinkStatus {
  COMPLETED = 'completed',
  SUBMITTED = 'submitted',
  OPTIONAL = 'optional',
  VIEWED = 'viewed',
  NOT_VIEWED = 'notViewedYet',
  NOT_YET_AVAILABLE = 'notAvailableYet',
  WAITING_FOR_TRIBUNAL = 'waitingForTheTribunal',
  SUBMITTED_AND_VIEWED = 'submittedAndViewed',
  IN_PROGRESS = 'inProgress',
  NOT_STARTED_YET = 'notStartedYet',
}

export const hubLinksUrlMap = new Map<string, string>([
  [HubLinkNames.Et1ClaimForm, PageUrls.CLAIM_DETAILS],
  [HubLinkNames.RespondentResponse, PageUrls.CITIZEN_HUB_DOCUMENT_RESPONSE_RESPONDENT],
  [HubLinkNames.ContactTribunal, PageUrls.CONTACT_THE_TRIBUNAL],
  [HubLinkNames.RequestsAndApplications, PageUrls.YOUR_APPLICATIONS],
  [HubLinkNames.RespondentApplications, PageUrls.RESPONDENT_APPLICATIONS],
  [HubLinkNames.TribunalOrders, PageUrls.TRIBUNAL_ORDERS_AND_REQUESTS],
]);

export const statusColorMap = new Map<HubLinkStatus, string>([
  [HubLinkStatus.COMPLETED, '--green'],
  [HubLinkStatus.SUBMITTED, '--turquoise'],
  [HubLinkStatus.OPTIONAL, '--blue'],
  [HubLinkStatus.VIEWED, '--turquoise'],
  [HubLinkStatus.NOT_VIEWED, '--red'],
  [HubLinkStatus.NOT_YET_AVAILABLE, '--grey'],
  [HubLinkStatus.WAITING_FOR_TRIBUNAL, '--grey'],
  [HubLinkStatus.SUBMITTED_AND_VIEWED, '--turquoise'],
  [HubLinkStatus.IN_PROGRESS, '--yellow'],
  [HubLinkStatus.NOT_STARTED_YET, '--red'],
]);

export const sectionIndexToLinkNames: HubLinkNames[][] = [
  [HubLinkNames.PersonalDetails],
  [HubLinkNames.Et1ClaimForm],
  [HubLinkNames.RespondentResponse],
  [HubLinkNames.HearingDetails],
  [HubLinkNames.RequestsAndApplications, HubLinkNames.RespondentApplications, HubLinkNames.ContactTribunal],
  [HubLinkNames.TribunalOrders],
  [HubLinkNames.TribunalJudgements],
  [HubLinkNames.Documents],
];
