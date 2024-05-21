import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { getDocId } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import {
  isBundlesDoc,
  isDocFromJudgement,
  isDocInDocumentCollection,
  isDocInPseRespondCollection,
  isDocOnApplicationPage,
} from './helpers/AllDocumentsHelper';
import { isRequestDocId, isRequestResponseDocId, isRequestTribunalResponseDocId } from './helpers/DocumentHelpers';

const logger = getLogger('AttachmentController');

/**
 * Displays a supporting material document
 */
export default class AttachmentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const docId = req.params.docId;
    const userCase = req.session?.userCase;

    if (!docId) {
      logger.warn('no docId provided');
      return res.redirect('/not-found');
    }

    if (
      docId === getDocId(userCase.contactApplicationFile?.document_url) ||
      docId === getDocId(userCase.supportingMaterialFile?.document_url) ||
      isDocOnApplicationPage(req, docId) ||
      isRequestDocId(req, docId) ||
      isRequestTribunalResponseDocId(req, docId) ||
      isRequestResponseDocId(req, docId) ||
      isDocFromJudgement(req, docId) ||
      isDocInDocumentCollection(req, docId) ||
      isBundlesDoc(req, docId) ||
      isDocInPseRespondCollection(req, docId)
    ) {
      try {
        const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);
        res.setHeader('Content-Type', document?.headers['content-type']);
        res.status(200).send(Buffer.from(document?.data, 'binary'));
      } catch (err) {
        logger.error(err.message);
        return res.redirect('/not-found');
      }
    } else {
      logger.warn('bad request parameter');
      return res.redirect('/not-found');
    }
  }
}
