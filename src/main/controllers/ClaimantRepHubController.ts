import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import {
  HubLinkNames,
  HubLinkStatus,
  HubLinksStatuses,
  sectionIndexToLinkNames,
  statusColorMap,
} from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { handleUpdateHubLinksStatuses } from './helpers/CaseHelpers';
import {
  getAcknowledgementAlert,
  getHubLinksUrlMap,
  shouldHubLinkBeClickable,
  shouldShowRejectionAlert,
  shouldShowSubmittedAlert,
  updateHubLinkStatuses,
} from './helpers/CitizenHubHelper';
import { getProgressBarItems } from './helpers/CitizenHubProgressBarHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('ClaimantRepHubController');

// Rep hub has an additional "About you" section at the front
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

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIMANT_REP_HUB, { returnObjects: true }),
    };

    if (!userCase.hubLinksStatuses || userCase.hubLinksStatuses['documents'] === HubLinkStatus.NOT_YET_AVAILABLE) {
      userCase.hubLinksStatuses = new HubLinksStatuses();
      await handleUpdateHubLinksStatuses(req, logger);
    }

    const hubLinksStatuses = userCase.hubLinksStatuses;
    updateHubLinkStatuses(userCase, hubLinksStatuses);

    const sections = repSectionIndexToLinkNames.map((linkNames, index) => ({
      title: (l: AnyRecord): string => l[`section${index + 1}`],
      links: linkNames.map(linkName => {
        const status = hubLinksStatuses[linkName];
        return {
          linkTxt: (l: AnyRecord): string => l[linkName],
          status: (l: AnyRecord): string => l[status],
          shouldShow: shouldHubLinkBeClickable(status, linkName),
          url: () => getHubLinksUrlMap(false, languageParam).get(linkName),
          statusColor: () => statusColorMap.get(status),
        };
      }),
    }));

    // Prepend the "About you" section (static, not yet available)
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

    // Prepend "View claimant contact details" to The Claim section (index 0 → section1 in repSections)
    sections[0].links.push({
      linkTxt: (l: AnyRecord): string => l.viewClaimantContactDetails,
      status: (l: AnyRecord): string => l[HubLinkStatus.READY_TO_VIEW],
      shouldShow: false,
      url: () => '',
      statusColor: () => statusColorMap.get(HubLinkStatus.READY_TO_VIEW),
    });

    const allSections = [aboutYouSection, ...sections];

    res.render(TranslationKeys.CLAIMANT_REP_HUB, {
      ...translations,
      PageUrls,
      userCase,
      languageParam,
      progressBarItems: getProgressBarItems(userCase, translations, req.url),
      sections: allSections,
      showSubmittedAlert: shouldShowSubmittedAlert(userCase),
      showAcknowledgementAlert: getAcknowledgementAlert(userCase, hubLinksStatuses),
      showRejectionAlert: shouldShowRejectionAlert(userCase, hubLinksStatuses),
    });
  };
}
