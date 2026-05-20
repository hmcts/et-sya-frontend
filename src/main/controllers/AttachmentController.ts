import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { FEATURE_FLAGS } from '../definitions/constants';
import { getDocId } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
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

    if (!userCase) {
      logger.warn('no userCase found in session');
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
        const streamingEnabled = await getFlagValue(FEATURE_FLAGS.DOCUMENT_STREAMING, null);
        const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId, streamingEnabled);
        res.setHeader('Content-Type', document?.headers['content-type']);
        if (document?.headers['content-length']) {
          res.setHeader('Content-Length', document.headers['content-length']);
        }
        res.status(200);
        (document?.data as NodeJS.ReadableStream).pipe(res);
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
