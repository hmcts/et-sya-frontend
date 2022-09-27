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

    const et1SupportId = getDocId(req.session.userCase.claimSummaryFile?.document_url);
    const et1DocumentDetails = { id: et1SupportId, description: '' } as DocumentDetail;
    userCase.et1DocumentDetails = [et1DocumentDetails];

    try {
      await getDocumentDetails(userCase.et1DocumentDetails, req.session.user?.accessToken);
    } catch (err) {
      logger.error(err.response?.status, err.response?.data, err);
    }

    res.render(TranslationKeys.CLAIM_DETAILS, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_DETAILS, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      PageUrls,
      userCase,
      hideContactUs: true,
      docs: [
        {
          date: '1st Jan',
          text: '<a href="#" target="_blank" class="govuk-link">ET1 Form</a>',
        },
        {
          date: et1DocumentDetails.createdOn,
          text: `<a href="/getCaseDocument/${et1SupportId}" target="_blank" class="govuk-link">ET1 support document</a>`,
        },
      ],
    });
  };
}
