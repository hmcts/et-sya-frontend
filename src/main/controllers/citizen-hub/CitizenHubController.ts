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
  getAcknowledgementAlert,
  getClaimantAppsAndUpdateStatusTag,
  getHubLinksUrlMap,
  getStoredPendingBannerList,
  shouldHubLinkBeClickable,
  shouldShowClaimantTribunalResponseReceived,
  shouldShowJudgmentReceived,
  shouldShowRejectionAlert,
  shouldShowRespondentAcknowledgement,
  shouldShowRespondentApplicationReceived,
  shouldShowRespondentRejection,
  shouldShowRespondentResponseReceived,
  shouldShowSubmittedAlert,
  updateHubLinkStatuses,
  userCaseContainsGeneralCorrespondence,
} from '../helpers/CitizenHubHelper';
import { getProgressBarItems } from '../helpers/CitizenHubProgressBarHelper';
import { shouldShowHearingBanner } from '../helpers/HearingHelpers';
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
  filterOutSpecialNotifications,
  getClaimantTribunalResponseBannerContent,
  setNotificationBannerData,
  shouldShowNotificationsBanner,
} from '../helpers/TribunalOrderOrRequestDetailsHelper';
import { getRespondentApplications, getRespondentBannerContent } from '../helpers/TseRespondentApplicationHelpers';
import { getMultiplePanelData, showMutipleData } from '../helpers/multiples/MultiplePanelHelper';

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

    if (
      userCase?.documentCollection?.length ||
      userCaseContainsGeneralCorrespondence(userCase.sendNotificationCollection)
    ) {
      await handleUpdateHubLinksStatuses(req, logger);
    }

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

    await activateTribunalOrdersAndRequestsLink(sendNotificationCollection, req.session?.userCase);

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

    const notifications = setNotificationBannerData(userCase?.sendNotificationCollection, req.url);
    const generalNotifications = filterOutSpecialNotifications(notifications);

    let respondentBannerContent = undefined;

    const respAppsReceived = shouldShowRespondentApplicationReceived(allApplications);
    if (respAppsReceived) {
      respondentBannerContent = getRespondentBannerContent(respondentApplications, translations, languageParam);
    }

    let judgmentBannerContent = undefined;
    let decisionBannerContent = undefined;
    const claimantTribunalResponseBannerContent = getClaimantTribunalResponseBannerContent(
      notifications,
      languageParam
    );

    if (userCase.hubLinksStatuses[HubLinkNames.TribunalJudgements] !== HubLinkStatus.NOT_YET_AVAILABLE) {
      judgmentBannerContent = getJudgmentBannerContent(judgments, languageParam);
      decisionBannerContent = getDecisionBannerContent(appsAndDecisions, translations, languageParam);
    }

    const showMultipleData = await showMutipleData(userCase);

    res.render(TranslationKeys.CITIZEN_HUB, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      PageUrls,
      userCase,
      progressBarItems: getProgressBarItems(userCase, translations, req.url),
      sections,
      respondentBannerContent,
      judgmentBannerContent,
      decisionBannerContent,
      claimantTribunalResponseBannerContent,
      hideContactUs: true,
      processingDueDate: getDueDate(formatDate(userCase.submittedDate), DAYS_FOR_PROCESSING),
      showSubmittedAlert: shouldShowSubmittedAlert(userCase),
      showAcknowledgementAlert: getAcknowledgementAlert(userCase, hubLinksStatuses),
      showRejectionAlert: shouldShowRejectionAlert(userCase, hubLinksStatuses),
      showRespondentResponseReceived: shouldShowRespondentResponseReceived(allApplications),
      showClaimantTribunalResponseReceived: shouldShowClaimantTribunalResponseReceived(notifications),
      showRespondentApplicationReceived: respAppsReceived,
      showRespondentRejection: shouldShowRespondentRejection(userCase, hubLinksStatuses),
      showRespondentAcknowledgement: shouldShowRespondentAcknowledgement(userCase, hubLinksStatuses),
      showJudgmentReceived: shouldShowJudgmentReceived(userCase, hubLinksStatuses),
      showNotificationsBanner: shouldShowNotificationsBanner(generalNotifications),
      respondentIsSystemUser: isRespondentSystemUser,
      adminNotifications: getApplicationsWithTribunalOrderOrRequest(allApplications, translations, languageParam),
      storedPendingApplication: getStoredPendingBannerList(
        userCase.tseApplicationStoredCollection,
        allApplications,
        notifications,
        languageParam
      ),
      showHearingBanner: shouldShowHearingBanner(userCase?.sendNotificationCollection),
      notifications: generalNotifications,
      languageParam: getLanguageParam(req.url),
      welshEnabled,
      showMultipleData,
      multiplePanelData: await getMultiplePanelData(userCase, translations, showMultipleData),
    });
  }
}
