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
    Object.values(HubLinkNames)
      .filter(name => name !== HubLinkNames.Et1ClaimForm)
      .forEach(name => {
        this[name] = HubLinkStatus.NOT_YET_AVAILABLE;
      });

    this[HubLinkNames.Et1ClaimForm] = HubLinkStatus.SUBMITTED;
  }
}

export const enum HubLinkStatus {
  COMPLETED = 'completed',
  SUBMITTED = 'submitted',
  OPTIONAL = 'optional',
  VIEWED = 'viewed',
  NOT_YET_AVAILABLE = 'notAvailableYet',
}

export const hubLinksUrlMap = new Map<string, string>([[HubLinkNames.Et1ClaimForm, PageUrls.CLAIM_DETAILS]]);

export const hubLinksColorMap = new Map<HubLinkStatus, string>([
  [HubLinkStatus.COMPLETED, '--green'],
  [HubLinkStatus.SUBMITTED, '--turquoise'],
  [HubLinkStatus.VIEWED, '--turquoise'],
  [HubLinkStatus.OPTIONAL, '--blue'],
  [HubLinkStatus.NOT_YET_AVAILABLE, '--grey'],
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
