import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { DocumentDetail } from '../definitions/definition';
import { getDocId } from '../helper/ApiFormatter';

import { getDocumentDetails } from './helpers/DocumentHelpers';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('ClaimDetailsController');

export default class ClaimDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;

    const et1DocumentDetails = userCase.et1DocumentDetails;
    if (userCase.claimSummaryFile?.document_url) {
      const et1SupportId = getDocId(userCase.claimSummaryFile.document_url);
      const supportDocDetails = { id: et1SupportId, description: '' } as DocumentDetail;
      et1DocumentDetails.push(supportDocDetails);

      try {
        await getDocumentDetails(et1DocumentDetails, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.response?.status, err.response?.data, err);
      }
    }

    const et1Documents = [];
    for (const doc of et1DocumentDetails) {
      et1Documents.push({
        date: doc.createdOn,
        id: doc.id,
        name: doc.originalDocumentName,
      });
    }

    res.render(TranslationKeys.CLAIM_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      PageUrls,
      userCase,
      hideContactUs: true,
      et1Documents,
    });
  };
}
