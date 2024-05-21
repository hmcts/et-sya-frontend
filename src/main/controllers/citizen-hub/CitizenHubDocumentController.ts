import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import {
  FEATURE_FLAGS,
  PageUrls,
  TranslationKeys,
  responseAcceptedDocTypes,
  responseRejectedDocTypes,
} from '../../definitions/constants';
import { DocumentDetail } from '../../definitions/definition';
import { createTable } from '../../definitions/govuk/govukTable';
import { HubLinkNames, HubLinkStatus } from '../../definitions/hub';
import { getLogger } from '../../logger';
import { getFlagValue } from '../../modules/featureFlag/launchDarkly';
import { handleUpdateHubLinksStatuses } from '../helpers/CaseHelpers';
import { getDocumentDetails } from '../helpers/DocumentHelpers';

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
          return req.session?.userCase?.responseRejectionDocumentDetail;
        case TranslationKeys.CITIZEN_HUB_RESPONSE_ACKNOWLEDGEMENT:
          return req.session?.userCase?.responseAcknowledgementDocumentDetail;
        case TranslationKeys.CITIZEN_HUB_RESPONSE_FROM_RESPONDENT:
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

    const translations: { [key: string]: string } = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(req?.params?.documentType, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
    };

    await handleUpdateHubLinksStatuses(req, logger);
    const eccFlag = await getFlagValue(FEATURE_FLAGS.ECC, null);

    const rows: { time: Date; date: string; subject: string; link: string }[] = [];

    const documentRows = getDocumentRows(translations, documents);
    rows.push(...documentRows.flat());

    const eccNotifications = getEccNotificationRows(req.session.userCase?.sendNotificationCollection || []);
    rows.push(...eccNotifications);

    rows.sort((a: any, b: any) => b.time - a.time);
    const table = createTable(rows, { date: 'text', subject: 'text', link: 'html' });

    const data = {
      ...translations,
      hideContactUs: true,
      docs: documents,
      // TODO: remove this once EEC Flag is live
      et3Forms: documents.filter(d => d.type === 'ET3'),
      et3Attachments: documents.filter(d => d.type === 'ET3 Attachment'),
      et3SupportingDocs: documents.filter(d => d.type === 'et3Supporting'),
      et3AcceptedDocs: documents.filter(d => responseAcceptedDocTypes.includes(d.type)),
      et3RejectionDocs: documents.filter(d => responseRejectedDocTypes.includes(d.type)),
      // End TODO
      tableContents: table,
      eccFlag,
    };

    res.render(view, data);
  };
}

function getDocumentRows(translations: Record<string, string>, documents: DocumentDetail[]) {
  const documentTypes: Record<string, string[]> = {
    [translations.et3FormText]: ['ET3'],
    [translations.et3AttachmentText]: ['ET3 Attachment'],
    [translations.supportingMaterials]: ['et3Supporting'],
    [translations.acceptanceLetter]: responseAcceptedDocTypes,
    [translations.rejectionLetter]: responseRejectedDocTypes,
  };

  return Object.entries(documentTypes).map(([key, value]) => {
    const docs = documents.filter(d => value.includes(d.type));
    return docs.map(d => {
      return {
        time: new Date(d.createdOn),
        date: d.createdOn,
        subject: key,
        link: `<a href="/getCaseDocument/${d.id}" target="_blank" class="govuk-link">${d.originalDocumentName}</a>`,
      };
    });
  });
}

function getEccNotificationRows(notifications: SendNotificationTypeItem[]) {
  const eccSubjects = ['Response (ET3)', 'Employer Contract Claim'];
  const eccNotifications =
    notifications?.reduce((acc, o) => {
      const found = eccSubjects.filter(ecc => o.value.sendNotificationSubjectString?.includes(ecc));
      if (found.length) {
        acc.push({ subject: found.join(', '), ...o });
      }
      return acc;
    }, [] as ({ subject: string } & SendNotificationTypeItem)[]) || [];

  return eccNotifications.map(n => {
    return {
      time: new Date(n.value.date),
      date: n.value.date,
      subject: n.subject,
      link: `<a href="${PageUrls.TRIBUNAL_ORDER_OR_REQUEST_DETAILS.replace(
        ':orderId',
        n.id
      )}" target="_blank" class="govuk-link">${n.value.sendNotificationTitle}</a>`,
    };
  });
}
