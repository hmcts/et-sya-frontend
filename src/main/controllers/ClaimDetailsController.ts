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

    const et1Documents = [
      {
        date: '1st Jan',
        id: '',
        name: 'ET1 Form',
      },
    ];

    if (userCase.claimSummaryFile?.document_url) {
      const et1SupportId = getDocId(userCase.claimSummaryFile.document_url);
      const et1DocumentDetails = { id: et1SupportId, description: '' } as DocumentDetail;
      userCase.et1DocumentDetails = [et1DocumentDetails];

      try {
        await getDocumentDetails(userCase.et1DocumentDetails, req.session.user?.accessToken);
      } catch (err) {
        logger.error(err.response?.status, err.response?.data, err);
      }

      et1Documents.push({
        date: et1DocumentDetails.createdOn,
        id: et1SupportId,
        name: 'ET1 support document',
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
