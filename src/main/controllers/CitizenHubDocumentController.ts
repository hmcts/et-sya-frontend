import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';

import { getDocumentDetails } from './helpers/DocumentHelpers';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CitizenHubDocumentController');

export default class CitizenHubDocumentController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const mapParamToDoc = (docId: string) => {
      switch (docId) {
        case TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT:
          return req.session?.userCase?.acknowledgementOfClaimLetterDetail;
        case TranslationKeys.CITIZEN_HUB_REJECTION:
          return req.session?.userCase?.rejectionOfClaimDocumentDetail;
        case TranslationKeys.CITIZEN_HUB_RESPONSE_REJECTION:
          return req.session?.userCase?.responseRejectionDocumentDetail;
        case TranslationKeys.CITIZEN_HUB_RESPONSE_ACKNOWLEDGEMENT:
          return req.session?.userCase?.responseAcknowledgementDocumentDetail;
        case TranslationKeys.CITIZEN_HUB_RESPONSE_FROM_RESPONDENT:
          return req.session?.userCase?.respondentResponseET3DocumentDetail;
        default:
          return undefined;
      }
    };

    const documents = mapParamToDoc(req?.params?.documentId);
    if (!documents) {
      logger.info('no documents found for ', req?.params?.documentId);
      return res.redirect('/not-found');
    }
    try {
      await getDocumentDetails(documents, req.session.user?.accessToken);
    } catch (err) {
      logger.error(err.response?.status, err.response?.data, err);
      return res.redirect('/not-found');
    }
    res.render('document-view', {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(req?.params?.documentId, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      hideContactUs: true,
      docs: documents,
    });
  };
}
