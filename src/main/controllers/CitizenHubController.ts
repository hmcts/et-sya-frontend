import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import {
  HubLinkNames,
  HubLinkStatus,
  HubLinksStatuses,
  hubLinksColorMap,
  hubLinksUrlMap,
  sectionIndexToLinkNames,
} from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { formatDate, fromApiFormat, getDueDate } from '../helper/ApiFormatter';
import { currentStateFn } from '../helper/state-sequence';
import { getLogger } from '../logger';
import mockUserCaseWithCitizenHubLinks from '../resources/mocks/mockUserCaseWithCitizenHubLinks';
import { getCaseApi } from '../services/CaseService';

import { handleUpdateHubLinksStatuses } from './helpers/CaseHelpers';

const logger = getLogger('CitizenHubController');

const DAYS_FOR_PROCESSING = 5;

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
    const currentState = currentStateFn(userCase);

    if (!userCase.hubLinksStatuses) {
      userCase.hubLinksStatuses = new HubLinksStatuses();
      await handleUpdateHubLinksStatuses(req, logger);
    }

    const hubLinksStatuses = userCase.hubLinksStatuses;

    // Mark respondent's response as waiting for the tribunal
    if (
      hubLinksStatuses[HubLinkNames.RespondentResponse] === HubLinkStatus.NOT_YET_AVAILABLE &&
      userCase.et3ResponseReceived
    ) {
      hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.WAITING_FOR_TRIBUNAL;
    }

    if (
      userCase.hubLinksStatuses[HubLinkNames.RespondentResponse] !== HubLinkStatus.VIEWED &&
      (userCase.responseAcknowledgementDocumentDetail?.length || userCase.responseRejectionDocumentDetail?.length)
    ) {
      userCase.hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.NOT_VIEWED;
    }

    if (
      userCase.hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.SUBMITTED_AND_VIEWED &&
      (userCase.acknowledgementOfClaimLetterDetail?.length || userCase.rejectionOfClaimDocumentDetail?.length)
    ) {
      userCase.hubLinksStatuses[HubLinkNames.Et1ClaimForm] = HubLinkStatus.NOT_VIEWED;
    }

    const sections = Array.from(Array(8)).map((__ignored, index) => {
      return {
        title: (l: AnyRecord): string => l[`section${index + 1}`],
        links: sectionIndexToLinkNames[index].map(linkName => {
          const status = hubLinksStatuses[linkName];
          return {
            linkTxt: (l: AnyRecord): string => l[linkName],
            status: (l: AnyRecord): string => l[status],
            shouldShow: status !== HubLinkStatus.NOT_YET_AVAILABLE && status !== HubLinkStatus.WAITING_FOR_TRIBUNAL,
            url: () => hubLinksUrlMap.get(linkName),
            statusColor: () => hubLinksColorMap.get(status),
          };
        }),
      };
    });

    res.render(TranslationKeys.CITIZEN_HUB, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      PageUrls,
      userCase,
      currentState,
      sections,
      hideContactUs: true,
      processingDueDate: getDueDate(formatDate(userCase.submittedDate), DAYS_FOR_PROCESSING),
      showSubmittedAlert:
        !userCase?.acknowledgementOfClaimLetterDetail?.length && !userCase?.rejectionOfClaimDocumentDetail?.length,
      showAcknowledgementAlert:
        !!userCase?.acknowledgementOfClaimLetterDetail?.length &&
        hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.VIEWED &&
        hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.SUBMITTED_AND_VIEWED,
      showRejectionAlert:
        !!userCase?.rejectionOfClaimDocumentDetail?.length &&
        hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.VIEWED &&
        hubLinksStatuses[HubLinkNames.Et1ClaimForm] !== HubLinkStatus.SUBMITTED_AND_VIEWED,
      showRespondentResponseReceived:
        hubLinksStatuses[HubLinkNames.RespondentResponse] === HubLinkStatus.WAITING_FOR_TRIBUNAL,
      showRespondentRejection:
        !!userCase?.responseRejectionDocumentDetail?.length &&
        hubLinksStatuses[HubLinkNames.RespondentResponse] !== HubLinkStatus.VIEWED,
      showRespondentAcknowledgement:
        !!userCase?.responseAcknowledgementDocumentDetail?.length &&
        hubLinksStatuses[HubLinkNames.RespondentResponse] !== HubLinkStatus.VIEWED,
      respondentResponseDeadline: userCase?.respondentResponseDeadline,
    });
  }
}
