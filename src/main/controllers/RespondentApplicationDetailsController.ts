import logger from '@pact-foundation/pact/src/common/logger';
import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { clearTseFields } from './ContactTheTribunalSelectedController';
import { getTseApplicationDetails } from './helpers/ApplicationDetailsHelper';
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

    const savedApplication = req.session.userCase.selectedGenericTseApplication;

    if (!savedApplication || (savedApplication && req.params.appId !== savedApplication.value.number)) {
      clearTseFields(userCase);
      req.session.userCase.selectedGenericTseApplication = selectedApplication;
    }

    const header = translations.applicationTo + translations[selectedApplication.value.type];
    const insetText = translations[selectedApplication.value.type];
    const document = selectedApplication.value?.documentUpload;
    const redirectUrl = `/respond-to-application/${selectedApplication.value.number}${getLanguageParam(req.url)}`;

    if (document) {
      try {
        await getDocumentAdditionalInformation(document, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.message);
        return res.redirect('/not-found');
      }
    }

    const downloadLink = createDownloadLink(document);

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.RESPONDENT_APPLICATION_DETAILS,
    ]);

    res.render(TranslationKeys.RESPONDENT_APPLICATION_DETAILS, {
      ...content,
      header,
      insetText,
      selectedApplication,
      redirectUrl,
      appContent: getTseApplicationDetails(selectedApplication, translations, downloadLink),
    });
  };
}
