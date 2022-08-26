import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

export default class ClaimSubmittedController {
  public get(req: AppRequest, res: Response): void {
    res.render(TranslationKeys.CLAIM_SUBMITTED, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CLAIM_SUBMITTED, { returnObjects: true }),
      hideContactUs: true,
      submissionReferenceText: '[Submission Reference]',
      claimSubmittedText: formatClaimSubmittedDate(),
      attachmentsText: 'None',
      tribunalOfficeText: '[Tribunal Office]',
      emailText: '[Email]',
      telephoneText: '[Telephone]',
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
