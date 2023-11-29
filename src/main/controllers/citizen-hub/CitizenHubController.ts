import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import {
  HubLinkNames,
  HubLinkStatus,
  HubLinksStatuses,
  sectionIndexToLinkNames,
  statusColorMap,
} from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';
import { formatDate, fromApiFormat, getDueDate } from '../../helper/ApiFormatter';
import { currentStateFn } from '../../helper/state-sequence';
import { getLogger } from '../../logger';
import { getFlagValue } from '../../modules/featureFlag/launchDarkly';
import mockUserCaseWithCitizenHubLinks from '../../resources/mocks/mockUserCaseWithCitizenHubLinks';
import { getCaseApi } from '../../services/CaseService';
import { getApplicationsWithTribunalOrderOrRequest } from '../helpers/AdminNotificationHelper';
import {
  clearPrepareDocumentsForHearingFields,
  clearTseFields,
  handleUpdateHubLinksStatuses,
} from '../helpers/CaseHelpers';
import {
  activateRespondentApplicationsLink,
  checkIfRespondentIsSystemUser,
  getClaimantAppsAndUpdateStatusTag,
  getHubLinksUrlMap,
  shouldHubLinkBeClickable,
  shouldShowAcknowledgementAlert,
  shouldShowJudgmentReceived,
  shouldShowRejectionAlert,
  shouldShowRespondentAcknolwedgement,
  shouldShowRespondentApplicationReceived,
  shouldShowRespondentRejection,
  shouldShowRespondentResponseReceived,
  shouldShowSubmittedAlert,
  updateHubLinkStatuses,
} from '../helpers/CitizenHubHelper';
import {
  activateJudgmentsLink,
  getAllAppsWithDecisions,
  getDecisionBannerContent,
  getDecisions,
  getJudgmentBannerContent,
  getJudgments,
} from '../helpers/JudgmentHelpers';
import { getLanguageParam } from '../helpers/RouterHelpers';
import {
  activateTribunalOrdersAndRequestsLink,
  filterActionableNotifications,
  filterSendNotifications,
  populateNotificationsWithRedirectLinksAndStatusColors,
} from '../helpers/TribunalOrderOrRequestHelper';
import { getRespondentApplications, getRespondentBannerContent } from '../helpers/TseRespondentApplicationHelpers';

const logger = getLogger('CitizenHubController');
const DAYS_FOR_PROCESSING = 7;
export default class CitizenHubController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    // Fake userCase for a11y tests. This isn't a nice way to do it but explained in commit.
    const welshEnabled = await getFlagValue('welsh-language', null);
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
    clearPrepareDocumentsForHearingFields(userCase);
    req.session.documentDownloadPage = undefined;
    const currentState = currentStateFn(userCase);

    const sendNotificationCollection = userCase?.sendNotificationCollection;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
    };

    if (!userCase.hubLinksStatuses || userCase.hubLinksStatuses['documents'] === HubLinkStatus.NOT_YET_AVAILABLE) {
      userCase.hubLinksStatuses = new HubLinksStatuses();
      await handleUpdateHubLinksStatuses(req, logger);
    }

    const hubLinksStatuses = userCase.hubLinksStatuses;

    getClaimantAppsAndUpdateStatusTag(userCase);

    /*
    if (
      (userCase?.documentCollection && userCase?.documentCollection.length) ||
      userCaseContainsGeneralCorrespondence(userCase.sendNotificationCollection)
    ) {
      userCase.hubLinksStatuses[HubLinkNames.Documents] = HubLinkStatus.NOT_YET_AVAILABLE;
      await handleUpdateHubLinksStatuses(req, logger);
    }
    */

    const allApplications = userCase?.genericTseApplicationCollection;

    const respondentApplications = getRespondentApplications(userCase);
    activateRespondentApplicationsLink(respondentApplications, userCase);

    let decisions = undefined;
    let appsAndDecisions = undefined;
    if (allApplications?.filter(it => it.value.adminDecision?.length)) {
      decisions = getDecisions(userCase);
      appsAndDecisions = getAllAppsWithDecisions(userCase);
    }

    let judgments = undefined;
    if (userCase?.sendNotificationCollection?.length) {
      judgments = getJudgments(userCase);
    }

    activateJudgmentsLink(judgments, decisions, req);

    activateTribunalOrdersAndRequestsLink(sendNotificationCollection, req.session?.userCase);

    updateHubLinkStatuses(userCase, hubLinksStatuses);

    const isRespondentSystemUser = checkIfRespondentIsSystemUser(userCase);

    const sections = Array.from(Array(sectionIndexToLinkNames.length)).map((__ignored, index) => {
      return {
        title: (l: AnyRecord): string => l[`section${index + 1}`],
        links: sectionIndexToLinkNames[index].map(linkName => {
          const status = hubLinksStatuses[linkName];
          return {
            linkTxt: (l: AnyRecord): string => l[linkName],
            status: (l: AnyRecord): string => l[status],
            shouldShow: shouldHubLinkBeClickable(status, linkName),
            url: () => getHubLinksUrlMap(isRespondentSystemUser, languageParam).get(linkName),
            statusColor: () => statusColorMap.get(status),
          };
        }),
      };
    });

    const notifications = filterSendNotifications(userCase?.sendNotificationCollection);
    populateNotificationsWithRedirectLinksAndStatusColors(notifications, req.url, translations);

    let respondentBannerContent = undefined;

    const respAppsReceived = shouldShowRespondentApplicationReceived(allApplications);
    if (respAppsReceived) {
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
      hideContactUs: true,
      processingDueDate: getDueDate(formatDate(userCase.submittedDate), DAYS_FOR_PROCESSING),
      showSubmittedAlert: shouldShowSubmittedAlert(userCase),
      showAcknowledgementAlert: shouldShowAcknowledgementAlert(userCase, hubLinksStatuses),
      showRejectionAlert: shouldShowRejectionAlert(userCase, hubLinksStatuses),
      showRespondentResponseReceived: shouldShowRespondentResponseReceived(allApplications),
      showRespondentApplicationReceived: respAppsReceived,
      showRespondentRejection: shouldShowRespondentRejection(userCase, hubLinksStatuses),
      showRespondentAcknowledgement: shouldShowRespondentAcknolwedgement(userCase, hubLinksStatuses),
      showJudgmentReceived: shouldShowJudgmentReceived(userCase, hubLinksStatuses),
      respondentResponseDeadline: userCase?.respondentResponseDeadline,
      showOrderOrRequestReceived: notifications?.length,
      respondentIsSystemUser: isRespondentSystemUser,
      adminNotifications: getApplicationsWithTribunalOrderOrRequest(allApplications, translations, languageParam),
      notifications: filterActionableNotifications(notifications),
      languageParam: getLanguageParam(req.url),
      welshEnabled,
    });
  }
}
