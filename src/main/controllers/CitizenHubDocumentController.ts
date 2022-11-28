import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys, responseRejectedDocTypes } from '../definitions/constants';
import { HubLinkNames, HubLinkStatus } from '../definitions/hub';
import { getLogger } from '../logger';

import { handleUpdateSubmittedCase } from './helpers/CaseHelpers';
import { getDocumentDetails } from './helpers/DocumentHelpers';

const logger = getLogger('CitizenHubDocumentController');

export default class CitizenHubDocumentController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const mapParamToDoc = (documentType: string) => {
      const userCase = req.session.userCase;
      switch (documentType) {
        case TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT:
          userCase.hubLinksStatuses[HubLinkNames.Et1ClaimForm] = HubLinkStatus.SUBMITTED_AND_VIEWED;
          return req.session?.userCase?.acknowledgementOfClaimLetterDetail;
        case TranslationKeys.CITIZEN_HUB_REJECTION:
          userCase.hubLinksStatuses[HubLinkNames.Et1ClaimForm] = HubLinkStatus.SUBMITTED_AND_VIEWED;
          return req.session?.userCase?.rejectionOfClaimDocumentDetail;
        case TranslationKeys.CITIZEN_HUB_RESPONSE_REJECTION:
          userCase.hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.VIEWED;
          return req.session?.userCase?.responseRejectionDocumentDetail;
        case TranslationKeys.CITIZEN_HUB_RESPONSE_ACKNOWLEDGEMENT:
          userCase.hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.VIEWED;
          return req.session?.userCase?.responseAcknowledgementDocumentDetail;
        case TranslationKeys.CITIZEN_HUB_RESPONSE_FROM_RESPONDENT:
          userCase.hubLinksStatuses[HubLinkNames.RespondentResponse] = HubLinkStatus.VIEWED;
          return req.session?.userCase?.responseEt3FormDocumentDetail;
        default:
          return undefined;
      }
    };

    const documents = mapParamToDoc(req?.params?.documentType);
    if (!documents) {
      logger.info('no documents found for ', req?.params?.documentType);
      return res.redirect('/not-found');
    }
    try {
      await getDocumentDetails(documents, req.session.user?.accessToken);
    } catch (err) {
      logger.error(err.message);
      return res.redirect('/not-found');
    }

    let view = 'document-view';
    if (req?.params?.documentType === TranslationKeys.CITIZEN_HUB_RESPONSE_FROM_RESPONDENT) {
      view = 'response-from-respondent-view';
    }

    handleUpdateSubmittedCase(req, logger);

    res.render(view, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(req?.params?.documentType, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      hideContactUs: true,
      docs: documents,
      et3Forms: documents.filter(d => d.type === 'ET3'),
      et3SupportingDocs: documents.filter(d => d.type === 'et3Supporting'),
      et3AcceptedDocs: documents.filter(d => d.type === '2.11'),
      et3RejectionDocs: documents.filter(d => responseRejectedDocTypes.includes(d.type)),
    });
  };
}
