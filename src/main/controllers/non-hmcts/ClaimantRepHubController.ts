import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { YesOrNo } from '../../definitions/case';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import {
  HubLinkNames,
  HubLinkStatus,
  HubLinksStatuses,
  sectionIndexToLinkNames,
  statusColorMap,
} from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';
import { fromApiFormat } from '../../helper/ApiFormatter';
import { getLogger } from '../../logger';
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
import { isClaimantRepresentedByOrganisation } from '../helpers/ContactTheTribunalHelper';
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

const logger = getLogger('ClaimantRepHubController');

const repSectionIndexToLinkNames: HubLinkNames[][] = [...sectionIndexToLinkNames];

export default class ClaimantRepHubController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const caseId = req.params.caseId;

    try {
      const caseData = await getCaseApi(req.session.user?.accessToken).getUserCase(caseId);
      req.session.userCase = fromApiFormat(caseData.data);
    } catch (error) {
      logger.error(`Error loading case ${caseId}: ${error.message}`);
      return res.redirect(PageUrls.CLAIMANT_APPLICATIONS);
    }

    const userCase = req.session.userCase;
    const languageParam = getLanguageParam(req.url);
    const claimantRepresentedByOrganisation = isClaimantRepresentedByOrganisation(userCase);

    clearTseFields(userCase);
    clearPrepareDocumentsForHearingFields(userCase);
    req.session.documentDownloadPage = undefined;

    const sendNotificationCollection = userCase?.sendNotificationCollection;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIMANT_REP_HUB, { returnObjects: true }),
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

    const sections = repSectionIndexToLinkNames.map((linkNames, index) => ({
      title: (l: AnyRecord): string => l[`section${index + 1}`],
      links: linkNames.map(linkName => {
        const status = hubLinksStatuses[linkName];
        return {
          linkTxt: (l: AnyRecord): string => l[linkName],
          status: (l: AnyRecord): string => l[status],
          shouldShow: shouldHubLinkBeClickable(status, linkName),
          url: () => getHubLinksUrlMap(isRespondentSystemUser, languageParam).get(linkName),
          statusColor: () => statusColorMap.get(status),
        };
      }),
    }));

    const aboutYouSection = {
      title: (l: AnyRecord): string => l.sectionAboutYou,
      links: [
        {
          linkTxt: (l: AnyRecord): string => l.personalDetails,
          status: (l: AnyRecord): string => l[HubLinkStatus.NOT_YET_AVAILABLE],
          shouldShow: false,
          url: () => '',
          statusColor: () => statusColorMap.get(HubLinkStatus.NOT_YET_AVAILABLE),
        },
      ],
    };

    sections[0].links.push({
      linkTxt: (l: AnyRecord): string => l.viewClaimantContactDetails,
      status: (l: AnyRecord): string => l[HubLinkStatus.READY_TO_VIEW],
      shouldShow: false,
      url: () => '',
      statusColor: () => statusColorMap.get(HubLinkStatus.READY_TO_VIEW),
    });

    const allSections = [aboutYouSection, ...sections];

    const notifications = setNotificationBannerData(userCase?.sendNotificationCollection, req.url);
    const generalNotifications = filterOutSpecialNotifications(notifications);

    const respAppsReceived = shouldShowRespondentApplicationReceived(allApplications);
    let respondentBannerContent = undefined;
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
    const showNoLongerRepresentedNotification = userCase?.claimantRepresentativeRemoved === YesOrNo.YES;

    res.render(TranslationKeys.CLAIMANT_REP_HUB, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIMANT_REP_HUB, { returnObjects: true }),
      PageUrls,
      userCase,
      progressBarItems: getProgressBarItems(userCase, translations, req.url),
      sections: allSections,
      respondentBannerContent,
      judgmentBannerContent,
      decisionBannerContent,
      claimantTribunalResponseBannerContent,
      hideContactUs: true,
      showSubmittedAlert: shouldShowSubmittedAlert(userCase),
      claimantRepresented: userCase.claimantRepresentative,
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
      languageParam,
      showMultipleData,
      multiplePanelData: await getMultiplePanelData(userCase, translations, showMultipleData),
      showNoLongerRepresentedNotification,
      claimantRepresentedByOrganisation,
    });
  };
}
