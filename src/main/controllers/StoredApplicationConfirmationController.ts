import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';

export default class StoredApplicationConfirmationController {
  public get(req: AppRequest, res: Response): void {
    const viewThisCorrespondenceLink = 'viewThisCorrespondence';
    const fileNameOfSupportingDocName = '[file_name_of_supporting_doc]';
    const fileNameOfSupportingDocLink = 'fileNameOfSupportingDocLink';
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECKLIST);
    res.render(TranslationKeys.STORED_APPLICATION_CONFIRMATION, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.STORED_APPLICATION_CONFIRMATION, { returnObjects: true }),
      redirectUrl,
      viewThisCorrespondenceLink,
      fileNameOfSupportingDocName,
      fileNameOfSupportingDocLink,
    });
  }
}
