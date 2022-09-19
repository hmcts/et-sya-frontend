import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { getCaseApi } from '../services/CaseService';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CaseDocumentController');

export default class CaseDocumentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    try {
      if (!req.params?.docId) {
        logger.info('bad request parameter');
        return res.redirect('/citizen-hub/' + req.session?.userCase?.id);
      }
      const docId = req.params.docId;
      const allDocumentSets = [
        ...req.session.userCase.acknowledgementOfClaimLetterDetail,
        ...req.session.userCase.rejectionOfClaimDocumentDetail,
      ];
      const { mimeType } = allDocumentSets.find(doc => doc.id === docId);

      if (!mimeType) {
        logger.info('requested document not found in userCase');
        return res.redirect('/citizen-hub/' + req.session?.userCase?.id);
      }
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);

      res.setHeader('Content-Type', mimeType);
      res.status(200).send(Buffer.from(document.data, 'binary'));
    } catch (err) {
      logger.error(err.response?.status, err.response?.data, err?.message, err);
      return res.redirect('/not-found');
    }
  }
}
