import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TseRespondTypeItem } from '../definitions/complexTypes/genericTseApplicationTypeItem';
import { ErrorPages, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { datesStringToDateInLocale } from '../helper/dateInLocale';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getCaseApi } from '../services/CaseService';

import { responseToTribunalRequired } from './helpers/AdminNotificationHelper';
import {
  getAllResponses,
  getAllStoredClaimantResponses,
  getAllTseApplicationCollection,
  getTseApplicationDetails,
} from './helpers/ApplicationDetailsHelper';
import { getNewApplicationStatus } from './helpers/ApplicationStateHelper';
import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  populateDocumentMetadata,
} from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getDecisionContent } from './helpers/TseRespondentApplicationHelpers';

const logger = getLogger('ApplicationDetailsController');

export default class ApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_DETAILS, { returnObjects: true }),
    };

    req.session.documentDownloadPage = PageUrls.APPLICATION_DETAILS;

    const userCase = req.session.userCase;
    const selectedApplication = findSelectedGenericTseApplication(
      getAllTseApplicationCollection(userCase),
      req.params.appId
    );
    //Selected Tse application will be saved in the state.State will be cleared if you press 'Back'(to 'claim-details')
    userCase.selectedGenericTseApplication = selectedApplication;

    const header = translations.applicationTo + translations[selectedApplication.value.type];
    const document = selectedApplication.value?.documentUpload;

    const languageParam = getLanguageParam(req.url);
    const respondRedirectUrl = `/${TranslationKeys.RESPOND_TO_TRIBUNAL_RESPONSE}/${selectedApplication.id}${languageParam}`;
    const accessToken = req.session.user?.accessToken;
    const applicationDate = datesStringToDateInLocale(selectedApplication.value.date, req.url);

    let decisionContent;
    try {
      decisionContent = await getDecisionContent(selectedApplication, translations, accessToken);
    } catch (e) {
      logger.error(e.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    if (document) {
      try {
        await populateDocumentMetadata(document, accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect(ErrorPages.NOT_FOUND);
      }
    }

    const downloadLink = createDownloadLink(document);

    let allResponses: TseRespondTypeItem[];
    try {
      allResponses = await getAllResponses(selectedApplication, translations, req);
      allResponses.push(...(await getAllStoredClaimantResponses(selectedApplication, translations, req)));
    } catch (e) {
      logger.error(e.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

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

    const welshEnabled = await getFlagValue('welsh-language', null);

    res.render(TranslationKeys.APPLICATION_DETAILS, {
      ...content,
      header,
      selectedApplication,
      appContent: getTseApplicationDetails(selectedApplication, translations, downloadLink, applicationDate),
      isRespondButton: responseToTribunalRequired(selectedApplication),
      respondRedirectUrl,
      allResponses,
      decisionContent,
      welshEnabled,
    });
  };
}
