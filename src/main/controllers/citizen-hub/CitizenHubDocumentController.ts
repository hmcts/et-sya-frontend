import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { CaseWithId } from '../../definitions/case';
import { ErrorPages, TranslationKeys, Views } from '../../definitions/constants';
import { DocumentDetail } from '../../definitions/definition';
import { GovukTable, GovukTableRow } from '../../definitions/govuk/govukTable';
import { HubLinkNames, HubLinkStatus } from '../../definitions/hub';
import { AnyRecord } from '../../definitions/util-types';
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
      await getDocumentDetails(documents, userCase.ethosCaseReference, req.session.user?.accessToken);
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
      docs: generateTableContents(documents, documentType, translations),
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

const generateTableContents = (
  documents: DocumentDetail[],
  documentType: string,
  translations: AnyRecord
): GovukTable[] => {
  const tableContents: GovukTable[] = [];
  documents.forEach(doc => {
    tableContents.push({ rows: generateDocumentRows(doc, documentType, translations) });
  });
  return tableContents;
};

const generateDocumentRows = (
  doc: DocumentDetail,
  documentType: string,
  translations: AnyRecord
): GovukTableRow[][] => {
  const { description, document, documentDetails, date } = translations;
  const rows: GovukTableRow[][] = [];

  const descriptionText = getDescriptionText(doc, documentType, translations);
  rows.push([{ text: description.firstCell }, { text: descriptionText }]);

  rows.push([
    { text: document },
    {
      html: `<a href="/getCaseDocument/${doc.id}" target="_blank" class="govuk-link">${doc.originalDocumentName} [${doc.size}MB]</a>`,
    },
  ]);

  if (doc.description) {
    rows.push([{ text: documentDetails }, { html: doc.description }]);
  }

  rows.push([{ text: date }, { html: doc.createdOn }]);

  return rows;
};

const getDescriptionText = (doc: DocumentDetail, documentType: string, translations: AnyRecord): string => {
  const { description } = translations;
  if (documentType === TranslationKeys.CITIZEN_HUB_ACKNOWLEDGEMENT) {
    switch (doc.type) {
      case '2.7':
      case '2.8':
        return description.d2;
      case '7.7':
      case '7.8':
      case '7.8a':
        return description.d7;
      default:
        return description.secondCell;
    }
  }
  return description.secondCell;
};
