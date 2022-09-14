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
      const { mimeType } = req.session.userCase.acknowledgementOfClaimLetterDetail.find(doc => doc.id === docId);

      if (!mimeType) {
        throw new Error('details of document not found in session');
      }
      const docId = req.params.docId;
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);

      res.setHeader('Content-Type', mimeType);
      res.status(200).send(Buffer.from(document.data, 'binary'));
    } catch (err) {
      logger.error(err.response?.status, err.response?.data, err?.message, err);
      return res.redirect('/not-found');
    }
  }
}
