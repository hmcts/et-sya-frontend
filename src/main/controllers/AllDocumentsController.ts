import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { FEATURE_FLAGS, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { compareUploadDates } from './helpers/AllDocumentsHelper';
import { createDownloadLink, getDocumentsAdditionalInformation } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

const logger = getLogger('AllDocumentsController');
export default class AllDocumentsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    req.session.documentDownloadPage = PageUrls.ALL_DOCUMENTS;
    const languageParam = getLanguageParam(req.url);
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.ALL_DOCUMENTS, { returnObjects: true }),
      ...req.t(TranslationKeys.YOUR_APPLICATIONS, { returnObjects: true }),
      ...req.t(TranslationKeys.RESPONDENT_APPLICATIONS, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.ALL_DOCUMENTS,
    ]);

    const bundlesEnabled = await getFlagValue(FEATURE_FLAGS.BUNDLES, null);
    logger.info('Retrieved documentCollection for caseId: ' + userCase?.id);
    const docCollection = userCase.documentCollection?.length ? userCase.documentCollection : [];
    const bundleDocuments = userCase.bundleDocuments?.length && bundlesEnabled ? userCase.bundleDocuments : [];
    const allDocs = [...docCollection, ...bundleDocuments];
    if (allDocs?.length) {
      try {
        await getDocumentsAdditionalInformation(allDocs, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.message);
        res.redirect('/not-found');
      }
      allDocs.forEach(it => (it.downloadLink = createDownloadLink(it.value.uploadedDocument)));
    }
    const allDocsSorted: DocumentTypeItem[] = Array.from(allDocs).sort(compareUploadDates);
    res.render(TranslationKeys.ALL_DOCUMENTS, {
      ...content,
      translations,
      allDocsSorted,
      languageParam,
    });
  };
}
