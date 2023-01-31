import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

import { retrieveCurrentLocale } from './helpers/ApplicationTableRecordTranslationHelper';

export default class ClaimSubmittedController {
  public get(req: AppRequest, res: Response): void {
    const { userCase } = req.session;
    res.render(TranslationKeys.CLAIM_SUBMITTED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_SUBMITTED, { returnObjects: true }),
      hideContactUs: true,
      submissionReferenceText: userCase.id,
      claimSubmittedText: formatClaimSubmittedDate(new Date(), req),
      attachmentsText: formatAttachmentsText(userCase.claimSummaryFile?.document_filename, {
        ...req.t(TranslationKeys.CLAIM_SUBMITTED, { returnObjects: true }),
      }),
      downloadLink: '/getCaseDocument/' + userCase.et1SubmittedForm?.id,
      tribunalOfficeText: userCase.managingOffice,
      emailText: userCase.tribunalCorrespondenceEmail,
      telephoneText: userCase.tribunalCorrespondenceTelephone,
      PageUrls,
    });
  }
}

function formatClaimSubmittedDate(date: Date, req: AppRequest<Partial<AnyRecord>>) {
  return new Date(date).toLocaleDateString(retrieveCurrentLocale(req?.url), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const formatAttachmentsText = (fileName: string, translations: AnyRecord) => {
  if (fileName === undefined || fileName.length < 1) {
    return translations.none;
  }
  return fileName;
};
