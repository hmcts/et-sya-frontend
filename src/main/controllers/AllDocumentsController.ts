import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { DocumentTypeItem } from '../definitions/complexTypes/documentTypeItem';
import { AllDocumentTypes, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { createSortedDocumentsMap, prepareTableRows } from './helpers/AllDocumentsHelper';
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

    let sortedDocuments = undefined;
    let tribunalDocuments = undefined;
    let acasClaimantRespondentTableRows = undefined;

    const docCollection = userCase.documentCollection?.length ? userCase.documentCollection : [];
    const bundlesClaimantDocs = userCase.bundlesClaimantDocs?.length ? userCase.bundlesClaimantDocs : [];
    const bundlesRespondentDocs = userCase.bundlesRespondentDocs?.length ? userCase.bundlesRespondentDocs : [];
    const allDocs = [...docCollection, ...bundlesClaimantDocs, ...bundlesRespondentDocs];

    /**
     * Add meta data and download links for each document
     */
    const populateMetaDataAndLink = async (docs: DocumentTypeItem[]) => {
      if (docs?.length) {
        try {
          await getDocumentsAdditionalInformation(docs, req.session.user?.accessToken);
        } catch (err) {
          logger.error(err.message);
          res.redirect('/not-found');
        }
        docs.forEach(it => (it.downloadLink = createDownloadLink(it.value.uploadedDocument)));
      }
    };

    await populateMetaDataAndLink(allDocs);

    sortedDocuments = createSortedDocumentsMap(allDocs);

    tribunalDocuments = sortedDocuments.get(AllDocumentTypes.TRIBUNAL_CORRESPONDENCE);

    acasClaimantRespondentTableRows = prepareTableRows(sortedDocuments, translations, userCase);

    res.render(TranslationKeys.ALL_DOCUMENTS, {
      ...content,
      translations,
      tribunalDocuments,
      acasClaimantRespondentTableRows,
      languageParam,
    });
  };
}
