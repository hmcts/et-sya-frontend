import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CLAIMANT, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import { createDownloadLink, findSelectedGenericTseApplication } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import {
  getClaimantResponseDocDownloadLink,
  getDecisionContent,
  getDocumentAdditionalInfoAsync,
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

    const document = selectedApplication.value?.documentUpload;
    const accessToken = req.session.user?.accessToken;

    await getDocumentAdditionalInfoAsync(document, logger, accessToken, res);

    const claimantResponseDocDownloadLink = await getClaimantResponseDocDownloadLink(
      selectedApplication,
      logger,
      accessToken,
      res
    );

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const decisionContent = await getDecisionContent(logger, selectedApplication, translations, accessToken, res);

    const header = translations.applicationTo + translations[selectedApplication.value.type];
    const redirectUrl = `/respond-to-application/${selectedApplication.id}${getLanguageParam(req.url)}`;
    const respondButton = !selectedApplication.value.respondCollection?.some(r => r.value.from === CLAIMANT);
    const downloadLink = createDownloadLink(document);
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.RESPONDENT_APPLICATION_DETAILS,
    ]);

    res.render(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, {
      ...content,
      header,
      selectedApplication,
      redirectUrl,
      appContent: getTseApplicationDetails(selectedApplication, translations, downloadLink),
      decisionContent,
      respondButton,
      claimantResponseDocDownloadLink,
    });
  };
}
