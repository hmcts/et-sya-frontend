import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { getLogger } from '../logger';
import { getUserCasesByLastModified } from '../services/CaseSelectionService';
import { getCaseApi } from '../services/CaseService';

import {
  combineUserCaseDocuments,
  findContentTypeByDocument,
  findContentTypeByDocumentDetail,
} from './helpers/DocumentHelpers';

const logger = getLogger('CaseDocumentController');

/**
 * Displays a document given its docId.
 * Makes sure first that the document is referenced in the citizen's case to keep confidentiality.
 */
export default class CaseDocumentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    try {
      if (!req.params?.docId) {
        logger.info('bad request parameter');
        return res.redirect('/not-found');
      }

      const docId = req.params.docId;

      const userCases = await getUserCasesByLastModified(req);
      const allDocumentSets = combineUserCaseDocuments(userCases);

      const details = allDocumentSets.find(doc => doc.id === docId);
      if (!details) {
        logger.info('requested document not found in userCase');
        return res.redirect('/not-found');
      }
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);

      let contentType = findContentTypeByDocumentDetail(details);
      if (!contentType) {
        contentType = findContentTypeByDocument(document);
      }
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      } else {
        logger.error('Failed to download document with id: ' + details.id);
        res.setHeader('Content-Type', 'application/pdf');
      }
      res.status(200).send(Buffer.from(document.data, 'binary'));
    } catch (err) {
      logger.error(err.message);
      return res.redirect('/not-found');
    }
  }
}
