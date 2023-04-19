import logger from '@pact-foundation/pact/src/common/logger';
import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { createDownloadLink, findSelectedJudgment, getDocumentAdditionalInformation } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getJudgmentDetails } from './helpers/JudgmentHelpers';

export default class JudgmentDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session.userCase;
    req.session.documentDownloadPage = PageUrls.JUDGMENT_DETAILS;

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.JUDGMENT_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const selectedJudgment = findSelectedJudgment(userCase.sendNotificationCollection, req.params.appId);

    const header = selectedJudgment.value.sendNotificationTitle;
    const document = selectedJudgment.value?.sendNotificationUploadDocument[0].value.uploadedDocument;

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
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.JUDGMENT_DETAILS,
    ]);

    res.render(TranslationKeys.JUDGMENT_DETAILS, {
      ...content,
      header,
      selectedJudgment,
      appContent: getJudgmentDetails(selectedJudgment, translations, downloadLink),
    });
  };
}
