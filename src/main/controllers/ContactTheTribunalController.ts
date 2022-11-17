import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';

import { getPageContent } from './helpers/FormHelpers';

export default class ContactTheTribunalController {
  public get(req: AppRequest, res: Response): void {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_THE_TRIBUNAL,
    ]);
    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL, {
      ...content,
    });
  }
}
