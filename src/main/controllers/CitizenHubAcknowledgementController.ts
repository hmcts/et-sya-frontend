import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';

import { getDocumentDetails } from './helpers/DocumentHelpers';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CitizenHubAcknowledgementController');

export default class CitizenHubAcknowledgementController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    if (!req.session?.userCase?.acknowledgementOfClaimLetterDetail?.length) {
      return res.redirect('/not-found');
    }
    try {
      await getDocumentDetails(req.session.userCase.acknowledgementOfClaimLetterDetail, req.session.user?.accessToken);
    } catch (err) {
      logger.error(err.response?.status, err.response?.data, err);
      return res.redirect('/not-found');
    }

    res.render('document-view', {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      hideContactUs: true,
      docs: req.session.userCase.acknowledgementOfClaimLetterDetail,
    });
  };
}
