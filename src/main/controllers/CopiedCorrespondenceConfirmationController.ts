import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';

export default class CopiedCorrespondenceConfirmationController {
  public get(req: AppRequest, res: Response): void {
    const applicationType = '[Application type]';
    const fileNameOfSupportingDoc = '[file_name_of_supporting_doc]';
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECKLIST);
    res.render(TranslationKeys.COPIED_CORRESPONDENCE_CONFIRMATION, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.COPIED_CORRESPONDENCE_CONFIRMATION, { returnObjects: true }),
      redirectUrl,
      applicationType,
      fileNameOfSupportingDoc,
    });
  }
}
