import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { AllDocumentTypes, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getLogger } from '../logger';

import { createSortedDocumentsMap, prepareTableRows } from './helpers/AllDocumentsHelper';
import { createDownloadLink, getDocumentsAdditionalInformation } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';

const logger = getLogger('AllDocumentsController');
export default class AllDocumentsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const userCase = req.session?.userCase;
    const docCollection = userCase.documentCollection;
    req.session.documentDownloadPage = PageUrls.ALL_DOCUMENTS;

    try {
      await getDocumentsAdditionalInformation(docCollection, req.session.user?.accessToken);
    } catch (err) {
      logger.error(err.message);
      res.redirect('/not-found');
    }

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.ALL_DOCUMENTS, { returnObjects: true }),
    };

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.ALL_DOCUMENTS,
    ]);

    let sortedDocuments = undefined;
    let tribunalDocuments = undefined;
    let acasClaimantRespondentTableRows = undefined;

    if (docCollection && docCollection.length) {
      docCollection.forEach(it => (it.downloadLink = createDownloadLink(it.value.uploadedDocument)));
      sortedDocuments = createSortedDocumentsMap(docCollection);
      tribunalDocuments = sortedDocuments.get(AllDocumentTypes.TRIBUNAL_CORRESPONDENCE);
      acasClaimantRespondentTableRows = prepareTableRows(sortedDocuments, translations, userCase);
    }

    res.render(TranslationKeys.ALL_DOCUMENTS, {
      ...content,
      translations,
      tribunalDocuments,
      acasClaimantRespondentTableRows,
    });
  };
}
