import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('SupportingMaterialController');

/**
 * Displays a supporting material document
 */
export default class SupportingMaterialController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const userCase = req.session?.userCase;
    try {
      if (!userCase?.contactApplicationFile?.document_url) {
        logger.info('bad request parameter');
        return res.redirect('/not-found');
      }
      const docId = userCase.contactApplicationFile.document_url.replace(/.*\//g, '');
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);
      res.setHeader('Content-Type', document.headers['content-type']);
      res.status(200).send(Buffer.from(document.data, 'binary'));
    } catch (err) {
      logger.error(err.message);
      return res.redirect('/not-found');
    }
  }
}
