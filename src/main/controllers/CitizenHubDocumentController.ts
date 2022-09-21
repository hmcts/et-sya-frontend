import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';

import { getDocumentDetails } from './helpers/DocumentHelpers';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CitizenHubAcknowledgementController');

export default class CitizenHubDocumentController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const mapParamToDoc = (docId: string) => {
      switch (docId) {
        case 'acknowledgement':
          return req.session?.userCase?.acknowledgementOfClaimLetterDetail;
        case 'rejection':
          return req.session?.userCase?.rejectionOfClaimDocumentDetail;
        case 'response-rejection':
          return req.session?.userCase?.responseRejectionDocumentDetail;
        case 'response-acknowledgement':
          return req.session?.userCase?.responseAcknowledgementDocumentDetail;
        case 'response-from-respondent':
          return req.session?.userCase?.respondentResponseET3DocumentDetail;
        default:
          return undefined;
      }
    };
    const mapParamToTranslation = (docId: string) => {
      switch (docId) {
        case 'acknowledgement':
          return TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT;
        case 'rejection':
          return TranslationKeys.CITIZEN_HUB_REJECTION;
        case 'response-rejection':
          return TranslationKeys.CITIZEN_HUB_RESPONSE_REJECTION;
        case 'response-acknowledgement':
          return TranslationKeys.CITIZEN_HUB_RESPONSE_ACKNOWLEDGEMENT;
        case 'response-from-respondent':
          return TranslationKeys.CITIZEN_HUB_RESPONSE_FROM_RESPONDENT;
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
      ...req.t(mapParamToTranslation(req?.params?.documentId), { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      hideContactUs: true,
      docs: documents,
    });
  };
}
