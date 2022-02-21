import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { LegacyUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';

import { getPageContent } from './helpers';

export default class ContactAcasController {
  public get(req: AppRequest, res: Response): void {
    const content = getPageContent(req, <FormContent>{}, [TranslationKeys.COMMON, TranslationKeys.CONTACT_ACAS]);
    res.render(TranslationKeys.CONTACT_ACAS, {
      ...content,
      acasUrl: LegacyUrls.ACAS_EC_URL,
    });
  }
}
