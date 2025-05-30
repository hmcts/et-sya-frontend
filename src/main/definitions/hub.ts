export enum HubLinkNames {
  Et1ClaimForm = 'et1ClaimForm',
  RespondentResponse = 'respondentResponse',
  ViewRespondentContactDetails = 'viewRespondentContactDetails',
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
      if (name === HubLinkNames.Et1ClaimForm) {
        this[name] = HubLinkStatus.SUBMITTED;
      } else if (name === HubLinkNames.ContactTribunal) {
        this[name] = HubLinkStatus.OPTIONAL;
      } else if (name === HubLinkNames.Documents) {
        this[name] = HubLinkStatus.READY_TO_VIEW;
      } else {
        this[name] = HubLinkStatus.NOT_YET_AVAILABLE;
      }
    });
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
  STORED = 'stored',
  NOT_STARTED_YET = 'notStartedYet',
  UPDATED = 'updated',
  READY_TO_VIEW = 'readyToView',
}

const COLORS = {
  TURQUOISE: '--turquoise',
  GREEN: '--green',
  BLUE: '--blue',
  RED: '--red',
  GREY: '--grey',
  YELLOW: '--yellow',
};

export const statusColorMap = new Map<HubLinkStatus, string>([
  [HubLinkStatus.COMPLETED, COLORS.GREEN],
  [HubLinkStatus.SUBMITTED, COLORS.TURQUOISE],
  [HubLinkStatus.OPTIONAL, COLORS.BLUE],
  [HubLinkStatus.VIEWED, COLORS.TURQUOISE],
  [HubLinkStatus.NOT_VIEWED, COLORS.RED],
  [HubLinkStatus.NOT_YET_AVAILABLE, COLORS.GREY],
  [HubLinkStatus.WAITING_FOR_TRIBUNAL, COLORS.GREY],
  [HubLinkStatus.SUBMITTED_AND_VIEWED, COLORS.TURQUOISE],
  [HubLinkStatus.IN_PROGRESS, COLORS.YELLOW],
  [HubLinkStatus.STORED, COLORS.YELLOW],
  [HubLinkStatus.NOT_STARTED_YET, COLORS.RED],
  [HubLinkStatus.UPDATED, COLORS.BLUE],
  [HubLinkStatus.READY_TO_VIEW, COLORS.BLUE],
]);

export const displayStatusColorMap = new Map<HubLinkStatus, string>([
  [HubLinkStatus.SUBMITTED, COLORS.GREEN],
  [HubLinkStatus.VIEWED, COLORS.GREEN],
  [HubLinkStatus.NOT_VIEWED, COLORS.RED],
  [HubLinkStatus.NOT_STARTED_YET, COLORS.RED],
  [HubLinkStatus.STORED, COLORS.YELLOW],
]);

export const sectionIndexToLinkNames: HubLinkNames[][] = [
  [HubLinkNames.Et1ClaimForm],
  [HubLinkNames.RespondentResponse, HubLinkNames.ViewRespondentContactDetails],
  [HubLinkNames.HearingDetails],
  [HubLinkNames.RequestsAndApplications, HubLinkNames.RespondentApplications, HubLinkNames.ContactTribunal],
  [HubLinkNames.TribunalOrders],
  [HubLinkNames.TribunalJudgements],
  [HubLinkNames.Documents],
];
