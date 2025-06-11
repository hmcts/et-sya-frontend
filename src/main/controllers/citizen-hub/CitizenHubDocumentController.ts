import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { ErrorPages, TranslationKeys, Views } from '../../definitions/constants';
import { DocumentDetail } from '../../definitions/definition';
import { HubLinkNames, HubLinkStatus } from '../../definitions/hub';
import { getLogger } from '../../logger';
import { handleUpdateHubLinksStatuses } from '../helpers/CaseHelpers';
import { getDocumentDetails } from '../helpers/DocumentHelpers';

const logger = getLogger('CitizenHubDocumentController');

export default class CitizenHubDocumentController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const documentType = req.params?.documentType;
    const userCase = req.session?.userCase;

    const documents = mapParamToDoc(documentType, userCase);
    if (!documents) {
      logger.info('no documents found for ', documentType);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    try {
      await getDocumentDetails(documents, req.session.user?.accessToken);
    } catch (err) {
      logger.error(err.message);
      return res.redirect(ErrorPages.NOT_FOUND);
    }

    const translations: { [key: string]: string } = {
      ...(req.t(TranslationKeys.COMMON, { returnObjects: true }) as { [key: string]: string }),
      ...(req.t(documentType, { returnObjects: true }) as { [key: string]: string }),
      ...(req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }) as { [key: string]: string }),
      ...(req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }) as { [key: string]: string }),
    };

    if (
      documentType === TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT ||
      documentType === TranslationKeys.CITIZEN_HUB_REJECTION
    ) {
      userCase.hubLinksStatuses[HubLinkNames.Et1ClaimForm] = HubLinkStatus.SUBMITTED_AND_VIEWED;
      await handleUpdateHubLinksStatuses(req, logger);
    }

    res.render(Views.DOCUMENT_VIEW, {
      ...translations,
      hideContactUs: true,
      docs: documents,
    });
  };
}

const mapParamToDoc = (documentType: string, userCase: CaseWithId): DocumentDetail[] => {
  switch (documentType) {
    case TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT:
      return userCase?.acknowledgementOfClaimLetterDetail;
    case TranslationKeys.CITIZEN_HUB_REJECTION:
      return userCase?.rejectionOfClaimDocumentDetail;
    case TranslationKeys.CITIZEN_HUB_RESPONSE_REJECTION:
      return userCase?.responseRejectionDocumentDetail;
    case TranslationKeys.CITIZEN_HUB_RESPONSE_ACKNOWLEDGEMENT:
      return userCase?.responseAcknowledgementDocumentDetail;
    default:
      return undefined;
  }
};
