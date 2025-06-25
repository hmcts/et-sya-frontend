import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { SendNotificationTypeItem } from '../../definitions/complexTypes/sendNotificationTypeItem';
import {
  ErrorPages,
  FEATURE_FLAGS,
  PageUrls,
  TranslationKeys,
  Views,
  responseAcceptedDocTypes,
  responseRejectedDocTypes,
} from '../../definitions/constants';
import { DocumentDetail } from '../../definitions/definition';
import { createTable } from '../../definitions/govuk/govukTable';
import { getLogger } from '../../logger';
import { getFlagValue } from '../../modules/featureFlag/launchDarkly';
import { getDocumentDetails } from '../helpers/DocumentHelpers';

const logger = getLogger('CitizenHubResponseFromRespondentController');

export default class CitizenHubResponseFromRespondentController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const documents = req.session?.userCase?.responseEt3FormDocumentDetail;
    if (!documents) {
      logger.info('no documents found for ', TranslationKeys.CITIZEN_HUB_RESPONSE_FROM_RESPONDENT);
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
      ...(req.t(TranslationKeys.CITIZEN_HUB_RESPONSE_FROM_RESPONDENT, { returnObjects: true }) as {
        [key: string]: string;
      }),
      ...(req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }) as { [key: string]: string }),
      ...(req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }) as { [key: string]: string }),
    };

    const eccFlag = await getFlagValue(FEATURE_FLAGS.ECC, null);

    const rows: { time: Date; date: string; subject: string; link: string }[] = [];

    const documentRows = getDocumentRows(translations, documents);
    rows.push(...documentRows.flat());

    const eccNotifications = getEccNotificationRows(req.session.userCase?.sendNotificationCollection || []);
    rows.push(...eccNotifications);

    rows.sort((a: any, b: any) => b.time - a.time);
    const table = createTable(rows, { date: 'text', subject: 'text', link: 'html' });

    res.render(Views.RESPONSE_FROM_RESPONDENT_VIEW, {
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
    });
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
      link: `<a href="${PageUrls.NOTIFICATION_DETAILS.replace(':orderId', n.id)}" target="_blank" class="govuk-link">${
        n.value.sendNotificationTitle
      }</a>`,
    };
  });
}
