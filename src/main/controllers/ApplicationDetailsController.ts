import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { responseToTribunalRequired } from './helpers/AdminNotificationHelper';
import { getAllResponses, getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import { getNewApplicationStatus } from './helpers/ApplicationStateHelper';
import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  getDocumentAdditionalInformation,
} from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getDecisionContent } from './helpers/TseRespondentApplicationHelpers';

const logger = getLogger('ApplicationDetailsController');

export default class ApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
    };

    req.session.documentDownloadPage = PageUrls.APPLICATION_DETAILS;

    const userCase = req.session.userCase;
    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params.appId
    );
    //Selected Tse application will be saved in the state.State will be cleared if you press 'Back'(to 'claim-details')
    userCase.selectedGenericTseApplication = selectedApplication;

    const header = translations.applicationTo + translations[selectedApplication.value.type];
    const document = selectedApplication.value?.documentUpload;

    const languageParam = getLanguageParam(req.url);
    const respondRedirectUrl = `/${TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE}/${selectedApplication.id}${languageParam}`;
    const accessToken = req.session.user?.accessToken;
    const decisionContent = await getDecisionContent(logger, selectedApplication, translations, accessToken, res);

    if (!decisionContent) {
      logger.error("Couldn't get decision content. Ending journey here")
      return
    }

    if (document) {
      try {
        await getDocumentAdditionalInformation(document, accessToken);
      } catch (err) {
        logger.error(`HERE (${res.closed}): ${err.message}`);
        return res.redirect('/not-found');
      }
    }

    const downloadLink = createDownloadLink(document);

    const allResponses = await getAllResponses(selectedApplication, translations, req, res);

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.APPLICATION_DETAILS,
    ]);

    try {
      const newStatus = getNewApplicationStatus(selectedApplication);
      if (newStatus) {
        await getCaseApi(req.session.user?.accessToken).changeApplicationStatus(req.session.userCase, newStatus);
        selectedApplication.value.applicationState = newStatus;
        logger.info(`New status for claimant's application for case: ${req.session.userCase.id} - ${newStatus}`);
      }
    } catch (error) {
      logger.error(error.message);
      res.redirect(PageUrls.YOUR_APPLICATIONS);
    }

    res.render(TranslationKeys.APPLICATION_DETAILS, {
      ...content,
      header,
      selectedApplication,
      appContent: getTseApplicationDetails(selectedApplication, translations, downloadLink),
      isRespondButton: responseToTribunalRequired(selectedApplication),
      respondRedirectUrl,
      allResponses,
      decisionContent,
    });
  };
}
