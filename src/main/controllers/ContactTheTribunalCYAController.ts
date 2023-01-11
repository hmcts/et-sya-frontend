import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';

import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class ContactTheTribunalCYAController {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.CONTACT_THE_TRIBUNAL_CYA,
    ]);

    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, {
      ...content,
      PageUrls,
      userCase,
      respondents: req.session.userCase?.respondents,
      InterceptPaths,
      errors: req.session.errors,
      languageParam: getLanguageParam(req.url),
    });
  }
}
