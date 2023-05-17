import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import {
  HubLinkNames,
  HubLinkStatus,
  HubLinksStatuses,
  hubLinksUrlMap,
  sectionIndexToLinkNames,
  statusColorMap,
} from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { formatDate, fromApiFormat, getDueDate } from '../helper/ApiFormatter';
import { currentStateFn } from '../helper/state-sequence';
import { getLogger } from '../logger';
import mockUserCaseWithCitizenHubLinks from '../resources/mocks/mockUserCaseWithCitizenHubLinks';
import { getCaseApi } from '../services/CaseService';

import { clearTseFields, handleUpdateHubLinksStatuses } from './helpers/CaseHelpers';
import {
  shouldShowAcknowledgementAlert,
  shouldShowJudgmentReceived,
  shouldShowRejectionAlert,
  shouldShowRespondentAcknolwedgement,
  shouldShowRespondentApplicationReceived,
  shouldShowRespondentRejection,
  shouldShowRespondentResponseReceived,
  shouldShowSubmittedAlert,
  updateHubLinkStatuses,
  userCaseContainsGeneralCorrespondence,
} from './helpers/CitizenHubHelper';
import {
  activateJudgmentsLink,
  getAllAppsWithDecisions,
  getDecisionBannerContent,
  getDecisions,
  getJudgmentBannerContent,
  getJudgments,
  matchDecisionsToApps,
} from './helpers/JudgmentHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import {
  activateTribunalOrdersAndRequestsLink,
  filterNotificationsWithRequestsOrOrders,
  populateNotificationsWithRedirectLinksAndStatusColors,
} from './helpers/TribunalOrderOrRequestHelper';
import {
  activateRespondentApplicationsLink,
  getRespondentApplications,
  getRespondentBannerContent,
} from './helpers/TseRespondentApplicationHelpers';

const logger = getLogger('CitizenHubController');
const DAYS_FOR_PROCESSING = 7;

export default class CitizenHubController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    // Fake userCase for a11y tests. This isn't a nice way to do it but explained in commit.
    if (process.env.IN_TEST === 'true' && req.params.caseId === 'a11y') {
      req.session.userCase = mockUserCaseWithCitizenHubLinks;
    } else {
      try {
        req.session.userCase = fromApiFormat(
          (await getCaseApi(req.session.user?.accessToken).getUserCase(req.params.caseId)).data
        );
      } catch (error) {
        logger.error(error.message);
        return res.redirect('/not-found');
      }
    }

    const userCase = req.session.userCase;
    const languageParam = getLanguageParam(req.url);

    clearTseFields(userCase);
    req.session.documentDownloadPage = undefined;
    const currentState = currentStateFn(userCase);

    const sendNotificationCollection = userCase?.sendNotificationCollection;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    };

    if (!userCase.hubLinksStatuses) {
      userCase.hubLinksStatuses = new HubLinksStatuses();
      await handleUpdateHubLinksStatuses(req, logger);
    }

    const hubLinksStatuses = userCase.hubLinksStatuses;

    if (
      (hubLinksStatuses[HubLinkNames.Documents] === HubLinkStatus.NOT_YET_AVAILABLE &&
        userCase.documentCollection &&
        userCase.documentCollection.length) ||
      userCaseContainsGeneralCorrespondence(userCase.sendNotificationCollection)
    ) {
      userCase.hubLinksStatuses[HubLinkNames.Documents] = HubLinkStatus.OPTIONAL;
      await handleUpdateHubLinksStatuses(req, logger);
    }

    const respondentApplications = getRespondentApplications(userCase);
    activateRespondentApplicationsLink(respondentApplications, userCase);

    let decisions = undefined;
    let appsAndDecisions = undefined;
    if (userCase?.genericTseApplicationCollection?.filter(it => it.value.adminDecision?.length)) {
      decisions = getDecisions(userCase);
      const appsWithDecisions = getAllAppsWithDecisions(userCase);
      appsAndDecisions = matchDecisionsToApps(appsWithDecisions, decisions);
    }

    let judgments = undefined;
    if (userCase?.sendNotificationCollection?.length) {
      judgments = getJudgments(userCase);
    }

    activateJudgmentsLink(judgments, decisions, req);

    // Mark respondent's response as waiting for the tribunal
    if (
      hubLinksStatuses[HubLinkNames.RespondentResponse] === HubLinkStatus.NOT_YET_AVAILABLE &&
      userCase.et3ResponseReceived
    ) {
      hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.WAITING_FOR_TRIBUNAL;
    }

    activateTribunalOrdersAndRequestsLink(sendNotificationCollection, req);

    updateHubLinkStatuses(userCase, hubLinksStatuses);

    const sections = Array.from(Array(sectionIndexToLinkNames.length)).map((__ignored, index) => {
      return {
        title: (l: AnyRecord): string => l[`section${index + 1}`],
        links: sectionIndexToLinkNames[index].map(linkName => {
          const status = hubLinksStatuses[linkName];
          return {
            linkTxt: (l: AnyRecord): string => l[linkName],
            status: (l: AnyRecord): string => l[status],
            shouldShow: status !== HubLinkStatus.NOT_YET_AVAILABLE && status !== HubLinkStatus.WAITING_FOR_TRIBUNAL,
            url: () => hubLinksUrlMap.get(linkName),
            statusColor: () => statusColorMap.get(status),
          };
        }),
      };
    });

    const notifications = filterNotificationsWithRequestsOrOrders(userCase?.sendNotificationCollection);
    populateNotificationsWithRedirectLinksAndStatusColors(notifications, req.url, translations);

    let respondentBannerContent = undefined;

    if (userCase.hubLinksStatuses[HubLinkNames.RespondentApplications] === HubLinkStatus.IN_PROGRESS) {
      respondentBannerContent = getRespondentBannerContent(respondentApplications, translations, languageParam);
    }

    let judgmentBannerContent = undefined;
    let decisionBannerContent = undefined;

    if (userCase.hubLinksStatuses[HubLinkNames.TribunalJudgements] !== HubLinkStatus.NOT_YET_AVAILABLE) {
      judgmentBannerContent = getJudgmentBannerContent(judgments, languageParam);
      decisionBannerContent = getDecisionBannerContent(appsAndDecisions, translations, languageParam);
    }

    res.render(TranslationKeys.CITIZEN_HUB, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      PageUrls,
      userCase,
      currentState,
      sections,
      respondentBannerContent,
      judgmentBannerContent,
      decisionBannerContent,
      notifications,
      hideContactUs: true,
      processingDueDate: getDueDate(formatDate(userCase.submittedDate), DAYS_FOR_PROCESSING),
      showSubmittedAlert: shouldShowSubmittedAlert(userCase),
      showAcknowledgementAlert: shouldShowAcknowledgementAlert(userCase, hubLinksStatuses),
      showRejectionAlert: shouldShowRejectionAlert(userCase, hubLinksStatuses),
      showRespondentResponseReceived: shouldShowRespondentResponseReceived(hubLinksStatuses),
      showRespondentApplicationReceived: shouldShowRespondentApplicationReceived(hubLinksStatuses),
      showRespondentRejection: shouldShowRespondentRejection(userCase, hubLinksStatuses),
      showRespondentAcknowledgement: shouldShowRespondentAcknolwedgement(userCase, hubLinksStatuses),
      showJudgmentReceived: shouldShowJudgmentReceived(userCase, hubLinksStatuses),
      respondentResponseDeadline: userCase?.respondentResponseDeadline,
      showOrderOrRequestReceived: notifications?.length,
    });
  }
}
