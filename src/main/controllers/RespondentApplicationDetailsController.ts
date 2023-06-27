import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { Applicant, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { HubLinkStatus } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { getVisibleRequestFromAdmin, responseRequired } from './helpers/AdminNotificationHelper';
import { getAllResponses, getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import { findSelectedGenericTseApplication } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import {
  getApplicationDocDownloadLink,
  getDecisionContent,
  getResponseDocDownloadLink,
  setSelectedTseApplication,
} from './helpers/TseRespondentApplicationHelpers';

const logger = getLogger('RespondentApplicationDetailsController');

export default class RespondentApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    req.session.documentDownloadPage = PageUrls.RESPONDENT_APPLICATION_DETAILS;

    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params.appId
    );
    setSelectedTseApplication(req, userCase, selectedApplication);

    const accessToken = req.session.user?.accessToken;
    const responseDocDownloadLink = await getResponseDocDownloadLink(selectedApplication, logger, accessToken, res);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const allResponses = await getAllResponses(
      selectedApplication.value.respondCollection,
      translations,
      req.session.user?.accessToken,
      res
    );

    const decisionContent = await getDecisionContent(logger, selectedApplication, translations, accessToken, res);

    const header = translations.applicationTo + translations[selectedApplication.value.type];
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `${PageUrls.RESPOND_TO_APPLICATION}/${selectedApplication.id}${languageParam}`;
    const adminRespondRedirectUrl = `/${TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE}/${selectedApplication.id}${languageParam}`;
    const supportingMaterialDownloadLink = await getApplicationDocDownloadLink(
      selectedApplication,
      logger,
      accessToken,
      res
    );

    const respondButton = !selectedApplication.value.respondCollection?.some(r => r.value.from === Applicant.CLAIMANT);
    const adminRequests = getVisibleRequestFromAdmin(selectedApplication, translations, languageParam);
    const adminRespondButton = responseRequired(adminRequests);
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.RESPONDENT_APPLICATION_DETAILS,
    ]);

    const currStatus = selectedApplication.value.applicationState;
    try {
      let newStatus;

      switch (currStatus) {
        case HubLinkStatus.NOT_VIEWED:
          newStatus = HubLinkStatus.VIEWED;
          break;
        case HubLinkStatus.NOT_STARTED_YET:
        case HubLinkStatus.UPDATED:
          newStatus = HubLinkStatus.IN_PROGRESS;
          break;
        default:
      }

      if (newStatus) {
        await getCaseApi(req.session.user?.accessToken).changeApplicationStatus(req.session.userCase, newStatus);
        selectedApplication.value.applicationState = newStatus;
        logger.info(`New status for respondent's application for case: ${req.session.userCase.id} - ${newStatus}`);
      }
    } catch (error) {
      logger.error(error.message);
      res.redirect(PageUrls.RESPONDENT_APPLICATIONS);
    }

    res.render(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, {
      ...content,
      header,
      selectedApplication,
      redirectUrl,
      appContent: getTseApplicationDetails(selectedApplication, translations, supportingMaterialDownloadLink),
      decisionContent,
      respondButton,
      responseDocDownloadLink,
      adminRespondButton,
      adminRespondRedirectUrl,
      allResponses,
    });
  };
}
