import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { FEATURE_FLAGS } from '../definitions/constants';
import { getLogger } from '../logger';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getUserCasesByLastModified } from '../services/CaseSelectionService';
import { getCaseApi } from '../services/CaseService';

import { setRespondentResponseHubLinkStatus } from './helpers/CaseDocumentHelper';
import {
  combineUserCaseDocuments,
  findContentTypeByDocument,
  findContentTypeByDocumentDetail,
} from './helpers/DocumentHelpers';

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

      const userCases = await getUserCasesByLastModified(req);
      const allDocumentSets = combineUserCaseDocuments(userCases);

      const details = allDocumentSets.find(doc => doc && doc.id === docId);
      if (!details) {
        logger.info('requested document not found in userCase');
        return res.redirect('/not-found');
      }

      const streamingEnabled = await getFlagValue(FEATURE_FLAGS.DOCUMENT_STREAMING, null);
      const document = await getCaseApi(req.session.user?.accessToken).getCaseDocument(docId, streamingEnabled);

      let contentType = findContentTypeByDocumentDetail(details);
      if (!contentType) {
        contentType = findContentTypeByDocument(document);
      }
      if (contentType) {
        res.setHeader('Content-Type', contentType);
      } else {
        logger.error('Failed to download document with id: ' + details.id);
        res.setHeader('Content-Type', 'application/pdf');
      }
      if (document.headers['content-length']) {
        res.setHeader('Content-Length', document.headers['content-length']);
      }
      res.status(200);
      (document.data as NodeJS.ReadableStream).pipe(res);

      setRespondentResponseHubLinkStatus(details, req, logger);
    } catch (err) {
      logger.error(err.message);
      return res.redirect('/not-found');
    }
  }
}
