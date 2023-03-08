import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { combineDocuments } from './helpers/DocumentHelpers';

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
      const { submittedCase } = req.session;

      const allDocumentSets = combineDocuments(
        [submittedCase?.et1SubmittedForm],
        submittedCase?.allEt1DocumentDetails,
        submittedCase?.acknowledgementOfClaimLetterDetail,
        submittedCase?.rejectionOfClaimDocumentDetail,
        submittedCase?.responseEt3FormDocumentDetail
      );

      const details = allDocumentSets.find(doc => doc.id === docId);
      if (!details) {
        logger.info('requested document not found in userCase');
        return res.redirect('/not-found');
      }
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);

      if (!details.mimeType) {
        res.setHeader('Content-Type', 'application/pdf');
        logger.error('Failed document name: ' + details.id);
      } else {
        res.setHeader('Content-Type', details.mimeType);
      }

      res.status(200).send(Buffer.from(document.data, 'binary'));
    } catch (err) {
      logger.error(err.message);
      return res.redirect('/not-found');
    }
  }
}
