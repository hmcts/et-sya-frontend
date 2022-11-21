import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';

import { getPageContent } from './helpers/FormHelpers';

export default class ContactTribunalSelectedController {
  public get(req: AppRequest, res: Response): void {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.TRIBUNAL_CONTACT_SELECTED,
    ]);
    res.render(TranslationKeys.TRIBUNAL_CONTACT_SELECTED, {
      ...content,
    });
  }
}
