import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls } from '../definitions/constants';
import { getDocId } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getCaseApi } from '../services/CaseService';

import { isDocFromJudgement, isDocInDocumentCollection, isDocOnApplicationPage } from './helpers/AllDocumentsHelper';
import { getRequestDocId } from './helpers/DocumentHelpers';

const logger = getLogger('AttachmentController');

/**
 * Displays a supporting material document
 */
export default class AttachmentController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const docId = req.params.docId;
    const userCase = req.session?.userCase;

    if (!docId) {
      logger.info('no docId provided');
      return res.redirect('/not-found');
    }

    if (
      docId === getDocId(userCase.contactApplicationFile?.document_url) ||
      docId === getDocId(userCase.supportingMaterialFile?.document_url)
    ) {
      await downloadDocument(req, res, docId);
    } else if (isDocOnApplicationPage(req, docId)) {
      await downloadDocument(req, res, docId);
    } else if (
      req.session.documentDownloadPage === PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS ||
      req.session.documentDownloadPage === PageUrls.GENERAL_CORRESPONDENCE_NOTIFICATION_DETAILS
    ) {
      if (docId === getRequestDocId(req)) {
        await downloadDocument(req, res, docId);
      }
    } else if (isDocFromJudgement(req, docId)) {
      await downloadDocument(req, res, docId);
    } else if (req.session.documentDownloadPage === PageUrls.ALL_DOCUMENTS) {
      if (isDocInDocumentCollection(req, docId)) {
        await downloadDocument(req, res, docId);
      }
    } else {
      logger.info('bad request parameter');
      return res.redirect('/not-found');
    }
  }
}

const downloadDocument = async (req: AppRequest, res: Response, docId: string) => {
  try {
    const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId);
    res.setHeader('Content-Type', document?.headers['content-type']);
    res.status(200).send(Buffer.from(document?.data, 'binary'));
  } catch (err) {
    logger.error(err.message);
    return res.redirect('/not-found');
  }
};
