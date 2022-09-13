import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { getCaseApi } from '../services/CaseService';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CaseDocumentController');

export default class CaseDocumentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    try {
      if (!req.params || !req.params.docId || req.params.docId === '') {
        throw new Error('bad request paramater');
      }

      const docId = req.params.docId;
      const sessionDoc = req.session.userCase.acknowledgementOfClaimLetterDetail.find(doc => doc.id === docId);
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);

      res.setHeader('Content-Type', sessionDoc.mimeType);
      res.status(200).send(Buffer.from(document.data, 'binary'));
    } catch (error) {
      logger.info(error);
      res.redirect('not-found');
    }
  }
}
