import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { DefaultValues, FEATURE_FLAGS, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getDocId } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getCaseApi } from '../services/CaseService';

import { compareUploadDates } from './helpers/AllDocumentsHelper';
import { createDownloadLink } from './helpers/DocumentHelpers';
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
      const caseApi = getCaseApi(req.session.user?.accessToken);

      await Promise.all(
        allDocs.map(async it => {
          if (!it.value?.shortDescription && it.value?.typeOfDocument) {
            it.value.shortDescription = it.value.typeOfDocument;
          }
          it.downloadLink = createDownloadLink(it.value.uploadedDocument);

          const dateOfCorrespondence = it.value.dateOfCorrespondence;
          const uploadedDocument = it.value.uploadedDocument;

          try {
            const createdOnDate = dateOfCorrespondence
              ? new Date(dateOfCorrespondence)
              : new Date((await caseApi.getDocumentDetails(getDocId(uploadedDocument.document_url))).data.createdOn);

            uploadedDocument.createdOn = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(createdOnDate);
          } catch (err) {
            uploadedDocument.createdOn = DefaultValues.STRING_DASH;
            logger.error(
              `Error for: ${userCase.ethosCaseReference} - failed to fetch metadata for document: ${userCase.ethosCaseReference} ${err.message}`
            );
          }
        })
      );
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
