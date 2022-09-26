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

    // et1SupportId = req.session.userCase.claimSummaryFile.document_binary_url;

    res.render(TranslationKeys.CLAIM_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_DETAILS, { returnObjects: true }),
      PageUrls,
      userCase,
      docs: {
        et1Form: '<a href="#" target="_blank" class="govuk-link">ET1 Form</a>',
        et1Support: `<a href="${req.session.userCase.claimSummaryFile?.document_binary_url}" target="_blank" class="govuk-link">ET1 support document</a>`,
      },
    });
  };
}
