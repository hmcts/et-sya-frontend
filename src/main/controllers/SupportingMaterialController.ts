import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { getDocId } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

const logger = getLogger('SupportingMaterialController');

/**
 * Displays a supporting material document
 */
export default class SupportingMaterialController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const userCase = req.session?.userCase;
    let fileId = userCase?.contactApplicationFile?.document_url || userCase?.supportingMaterialFile?.document_url;
    if (!fileId && userCase.selectedGenericTseApplication) {
      fileId = userCase.selectedGenericTseApplication.value.documentUpload.document_url;
    }

    try {
      if (!fileId) {
        logger.info('bad request parameter');
        return res.redirect('/not-found');
      }
      const docId = getDocId(fileId);
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);
      res.setHeader('Content-Type', document.headers['content-type']);
      res.status(200).send(Buffer.from(document.data, 'binary'));
    } catch (err) {
      logger.error(err.message);
      return res.redirect('/not-found');
    }
  }
}
