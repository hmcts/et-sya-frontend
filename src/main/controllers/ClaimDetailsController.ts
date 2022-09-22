import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { combineDocuments, getDocumentDetails } from './helpers/DocumentHelpers';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('ClaimDetailsController');

export default class ClaimDetailsController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const { userCase } = req.session;

    try {
      await getDocumentDetails(
        combineDocuments(userCase?.acknowledgementOfClaimLetterDetail, userCase?.rejectionOfClaimDocumentDetail),
        req.session.user?.accessToken
      );
    } catch (err) {
      logger.error(err.response?.status, err.response?.data, err);
    }
    res.render(TranslationKeys.CLAIM_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_DETAILS, { returnObjects: true }),
      PageUrls,
      userCase: req.session?.userCase,
    });
  };
}
