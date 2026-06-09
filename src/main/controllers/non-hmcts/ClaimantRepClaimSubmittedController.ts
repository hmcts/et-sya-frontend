import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys, UNASSIGNED_OFFICE_EMAIL } from '../../definitions/constants';
import { AnyRecord } from '../../definitions/util-types';
import { getLanguageParam } from '../helpers/RouterHelpers';

export default class ClaimantRepClaimSubmittedController {
  public get(req: AppRequest, res: Response): void {
    if (req.session?.userCase) {
      req.session.submittedCase = req.session.userCase;
      req.session.userCase = null;
    }

    const { submittedCase } = req.session;
    const lang =
      req.cookies.i18next === TranslationKeys.WELSH || req.url?.includes('?lng=cy') ? TranslationKeys.WELSH : 'en-GB';

    res.cookie('i18next', lang, {
      secure: true,
    });

    const pageTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CLAIMANT_REP_CLAIM_SUBMITTED, { returnObjects: true }),
    };

    res.render(TranslationKeys.CLAIMANT_REP_CLAIM_SUBMITTED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...pageTranslations,
      hideContactUs: true,
      submissionReferenceText: submittedCase?.id,
      claimSubmittedText: formatClaimSubmittedDate(new Date(), lang),
      attachmentsText: formatAttachmentsText(submittedCase?.claimSummaryFile?.document_filename, pageTranslations),
      downloadLink: '/getCaseDocument/' + submittedCase?.et1SubmittedForm?.id,
      tribunalOfficeText: returnManagingOffice(submittedCase?.managingOffice, pageTranslations),
      emailText: returnEmailText(submittedCase?.tribunalCorrespondenceEmail, submittedCase?.managingOffice),
      telephoneText: submittedCase?.tribunalCorrespondenceTelephone,
      PageUrls,
      languageParam: getLanguageParam(req.url),
      redirectUrl: `/claimant-rep-hub/${submittedCase?.id}${getLanguageParam(req.url)}`,
    });
  }
}

function formatClaimSubmittedDate(date: Date, lang: string): string {
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

function returnEmailText(tribunalCorrespondenceEmail: string, managingOffice: string): string {
  if (managingOffice === 'Unassigned') {
    return UNASSIGNED_OFFICE_EMAIL;
  }
  return tribunalCorrespondenceEmail;
}

const formatAttachmentsText = (fileName: string, translations: AnyRecord): string => {
  if (fileName === undefined || fileName.length < 1) {
    return translations.none;
  }
  return fileName;
};
