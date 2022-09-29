import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

export default class ClaimSubmittedController {
  public get(req: AppRequest, res: Response): void {
    const { userCase } = req.session;
    res.render(TranslationKeys.CLAIM_SUBMITTED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_SUBMITTED, { returnObjects: true }),
      hideContactUs: true,
      submissionReferenceText: userCase.ethosCaseReference,
      claimSubmittedText: formatClaimSubmittedDate(),
      attachmentsText: formatAttachmentsText(userCase.claimSummaryFile?.document_filename),
      downloadLink: '/getCaseDocument/' + userCase.et1SubmittedForm?.id,
      tribunalOfficeText: userCase.managingOffice,
      emailText: userCase.tribunalCorrespondenceEmail,
      telephoneText: userCase.tribunalCorrespondenceTelephone,
      PageUrls,
    });
  }
}

function formatClaimSubmittedDate(date: Date = new Date()) {
  const year = date.toLocaleString('default', { year: 'numeric' });
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.toLocaleString('default', { day: '2-digit' });

  return `${day} ${month} ${year}`;
}

const formatAttachmentsText = (fileName: string) => {
  if (fileName === undefined || fileName.length < 1) {
    return 'None';
  }
  return fileName;
};
