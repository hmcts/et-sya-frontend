import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { Applicant, ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { datesStringToDateInLocale } from '../helper/dateInLocale';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
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

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, { returnObjects: true }),
    };

    let allResponses;
    try {
      allResponses = await getAllResponses(selectedApplication, translations, req);
    } catch (e) {
      logger.error(e);
      return res.redirect(ErrorPages.NOT_FOUND);
    }
    let decisionContent;
    try {
      decisionContent = await getDecisionContent(selectedApplication, translations);
    } catch (e) {
      logger.error(e);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const header = translations.applicationTo + translations[selectedApplication.value.type];
    const languageParam = getLanguageParam(req.url);
    const redirectUrl =
      PageUrls.RESPOND_TO_APPLICATION_SELECTED.replace(':appId', selectedApplication.id) + languageParam;
    const adminRespondRedirectUrl = `/${TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE}/${selectedApplication.id}${languageParam}`;
    const applicationDate = datesStringToDateInLocale(selectedApplication.value.date, req.url);

    let supportingMaterialDownloadLink;
    try {
      supportingMaterialDownloadLink = await getApplicationDocDownloadLink(selectedApplication);
    } catch (e) {
      logger.error(e.message);
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
        await getCaseApi(req.session.user?.accessToken).changeApplicationStatus(req.session.userCase, newStatus);
        selectedApplication.value.applicationState = newStatus;
        logger.info(`New status for respondent's application for case: ${req.session.userCase.id} - ${newStatus}`);
      }
    } catch (error) {
      logger.error(error.message);
      res.redirect(PageUrls.RESPONDENT_APPLICATIONS);
    }

    const welshEnabled = await getFlagValue('welsh-language', null);

    res.render(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, {
      ...content,
      header,
      selectedApplication,
      redirectUrl,
      appContent: getTseApplicationDetails(
        selectedApplication,
        translations,
        supportingMaterialDownloadLink,
        applicationDate
      ),
      decisionContent,
      respondButton,
      isAdminRespondButton: responseToTribunalRequired(selectedApplication),
      isClaimantRepresented: req.session.userCase.claimantRepresentative !== undefined,
      adminRespondRedirectUrl,
      allResponses,
      welshEnabled,
    });
  };
}
