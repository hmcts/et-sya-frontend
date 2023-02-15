import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

export default class ClaimSubmittedController {
  public get(req: AppRequest, res: Response): void {
    const { userCase } = req.session;
    const lang =
      req.cookies.i18next === TranslationKeys.WELSH || req.url?.includes('?lng=cy') ? TranslationKeys.WELSH : 'en-GB';
    const pageTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CLAIM_SUBMITTED, { returnObjects: true }),
    };
    res.render(TranslationKeys.CLAIM_SUBMITTED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_SUBMITTED, { returnObjects: true }),
      hideContactUs: true,
      submissionReferenceText: userCase.id,
      claimSubmittedText: formatClaimSubmittedDate(new Date(), lang),
      attachmentsText: formatAttachmentsText(userCase.claimSummaryFile?.document_filename, pageTranslations),
      downloadLink: '/getCaseDocument/' + userCase.et1SubmittedForm?.id,
      tribunalOfficeText: returnManagingOffice(userCase.managingOffice, pageTranslations),
      emailText: userCase.tribunalCorrespondenceEmail,
      telephoneText: userCase.tribunalCorrespondenceTelephone,
      PageUrls,
    });
  }
}

function formatClaimSubmittedDate(date: Date, lang: string) {
  return new Date(date).toLocaleDateString(lang, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function returnManagingOffice(managingOffice: string, pageTranslations: AnyRecord): string {
  if (managingOffice === 'Wales' || managingOffice === 'Unassigned') {
    return pageTranslations[managingOffice];
  }
  return managingOffice;
}

const formatAttachmentsText = (fileName: string, translations: AnyRecord) => {
  if (fileName === undefined || fileName.length < 1) {
    return translations.none;
  }
  return fileName;
};
