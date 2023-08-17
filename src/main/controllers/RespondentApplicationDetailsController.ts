import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { Applicant, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { responseToTribunalRequired } from './helpers/AdminNotificationHelper';
import { getAllResponses, getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import { getNewApplicationStatus } from './helpers/ApplicationStateHelper';
import { findSelectedGenericTseApplication } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import {
  getApplicationDocDownloadLink,
  getDecisionContent,
  getResponseDocDownloadLink,
  setSelectedTseApplication,
} from './helpers/TseRespondentApplicationHelpers';
import { ErrorPages } from '../definitions/constants';

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
    let responseDocDownloadLink;
    
    try { 
      responseDocDownloadLink = await getResponseDocDownloadLink(selectedApplication, accessToken);
    } catch (e) {
      logger.error(e);
      return res.redirect(ErrorPages.NOT_FOUND);
    } 

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    let allResponses
    try { allResponses = await getAllResponses(selectedApplication, translations, req); }
    catch(e) {
      logger.error(e)
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    let decisionContent

    try {
      decisionContent = await getDecisionContent(selectedApplication.value, translations, accessToken);
    } catch (e) {
      logger.error(e)
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const header = translations.applicationTo + translations[selectedApplication.value.type];
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `${PageUrls.RESPOND_TO_APPLICATION}/${selectedApplication.id}${languageParam}`;
    const adminRespondRedirectUrl = `/${TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE}/${selectedApplication.id}${languageParam}`;

    let supportingMaterialDownloadLink

    try {
      supportingMaterialDownloadLink = await getApplicationDocDownloadLink(selectedApplication, accessToken);
    } catch (e) {
      logger.error(e);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const respondButton = !selectedApplication.value.respondCollection?.some(r => r.value.from === Applicant.CLAIMANT);
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.RESPONDENT_APPLICATION_DETAILS,
    ]);

    try {
      const newStatus = getNewApplicationStatus(selectedApplication);
      if (newStatus) {
        await getCaseApi(accessToken).changeApplicationStatus(req.session.userCase, newStatus);
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
      appContent: getTseApplicationDetails(selectedApplication.value, translations, supportingMaterialDownloadLink),
      decisionContent,
      respondButton,
      responseDocDownloadLink,
      isAdminRespondButton: responseToTribunalRequired(selectedApplication),
      adminRespondRedirectUrl,
      allResponses,
    });
  };
}
