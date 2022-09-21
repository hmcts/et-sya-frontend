import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys, responseRejectedDocTypes } from '../definitions/constants';

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
          return req.session?.userCase?.responseEt3FormDocumentDetail;
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

    let view = 'document-view';
    if (req?.params?.documentId === TranslationKeys.CITIZEN_HUB_RESPONSE_FROM_RESPONDENT) {
      view = 'response-from-respondent-view';
    }

    res.render(view, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(req?.params?.documentId, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      hideContactUs: true,
      docs: documents,
      et3Form: documents.find(d => d.type === 'ET3'),
      et3SupportingDoc: documents.find(d => d.type === 'et3Supporting'),
      et3AcceptedDoc: documents.find(d => d.type === '2.11'),
      et3RejectionDoc: documents.find(d => responseRejectedDocTypes.includes(d.type)),
    });
  };
}
