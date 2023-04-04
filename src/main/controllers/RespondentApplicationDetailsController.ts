import logger from '@pact-foundation/pact/src/common/logger';
import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CLAIMANT, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { clearTseFields } from './ContactTheTribunalSelectedController';
import { getTseApplicationDecisionDetails, getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
import {
  createDownloadLink,
  findSelectedGenericTseApplication,
  getDocumentAdditionalInformation,
} from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class RespondentApplicationDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const selectedApplication = findSelectedGenericTseApplication(
      userCase.genericTseApplicationCollection,
      req.params.appId
    );

    const respondButton = !selectedApplication.value.respondCollection?.some(r => r.value.from === CLAIMANT);

    const savedApplication = req.session.userCase.selectedGenericTseApplication;

    if (!savedApplication || (savedApplication && req.params.appId !== savedApplication.value.number)) {
      clearTseFields(userCase);
      req.session.userCase.selectedGenericTseApplication = selectedApplication;
    }

    const header = translations.applicationTo + translations[selectedApplication.value.type];
    const document = selectedApplication.value?.documentUpload;
    const redirectUrl = `/respond-to-application/${selectedApplication.id}${getLanguageParam(req.url)}`;

    if (document) {
      try {
        await getDocumentAdditionalInformation(document, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect('/not-found');
      }
    }

    let claimantResponseDocDownload = undefined;

    if (selectedApplication.value?.respondCollection && selectedApplication.value?.respondCollection.length) {
      for (let i = selectedApplication.value?.respondCollection.length - 1; i >= 0; i--) {
        if (
          selectedApplication.value?.respondCollection[i].value.from === 'Claimant' &&
          selectedApplication.value?.respondCollection[i].value.supportingMaterial !== undefined
        ) {
          claimantResponseDocDownload =
            selectedApplication.value?.respondCollection[i].value.supportingMaterial[0].value.uploadedDocument;
        }
      }
    }

    if (claimantResponseDocDownload) {
      try {
        await getDocumentAdditionalInformation(claimantResponseDocDownload, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect('/not-found');
      }
    }

    const claimantResponseDocDownloadLink = createDownloadLink(claimantResponseDocDownload);

    let decisionContent = undefined;
    const decisionDocDownload = [];
    const decisionDocDownloadLink = [];

    if (selectedApplication.value?.adminDecision && selectedApplication.value?.adminDecision.length) {
      for (let i = selectedApplication.value?.adminDecision.length - 1; i >= 0; i--) {
        if (selectedApplication.value?.adminDecision[i].value.responseRequiredDoc !== undefined) {
          decisionDocDownload[i] = selectedApplication.value?.adminDecision[i].value.responseRequiredDoc;
        }
      }
    }

    if (decisionDocDownload.length > 0) {
      for (let i = decisionDocDownload.length - 1; i >= 0; i--) {
        if (decisionDocDownload[i]) {
          try {
            await getDocumentAdditionalInformation(decisionDocDownload[i], req.session.user?.accessToken);
          } catch (err) {
            logger.error(err.message);
            return res.redirect('/not-found');
          }
          decisionDocDownloadLink[i] = createDownloadLink(decisionDocDownload[i]);
        }
      }
      decisionContent = getTseApplicationDecisionDetails(selectedApplication, translations, decisionDocDownloadLink);
    }

    if (selectedApplication.value?.adminDecision && selectedApplication.value?.adminDecision.length) {
      decisionContent = getTseApplicationDecisionDetails(selectedApplication, translations, decisionDocDownloadLink);
    }

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
