import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { getDocId } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('TribunalOrderDocumentController');

/**
 * Displays a tribunal order material document
 */
export default class TribunalOrderDocumentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const docId = req.params.docId;
    if (!docId) {
      logger.info('bad request parameter');
      return res.redirect('/not-found');
    }

    const selectedFileId = req.session.userCase.selectedRequestOrOrder.value.sendNotificationUploadDocument
      .map(it => getDocId(it.value.uploadedDocument.document_url))
      .find(id => id === docId);

    try {
      if (!selectedFileId) {
        logger.info('bad request parameter');
        return res.redirect('/not-found');
      }
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(selectedFileId);
      res.setHeader('Content-Type', document.headers['content-type']);
      res.status(200).send(Buffer.from(document.data, 'binary'));
    } catch (err) {
      logger.error(err.message);
      return res.redirect('/not-found');
    }
  }
}
