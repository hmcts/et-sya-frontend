import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

import { getRule92AnswerDetails } from './helpers/CheckYourAnswersRule92Helper';
import { setUrlLanguage } from './helpers/LanguageHelper';

export default class CheckYourAnswersRule92Controller {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CHECK_YOUR_ANSWERS_RULE92, { returnObjects: true }),
    };
    const redirectUrl = setUrlLanguage(req, PageUrls.CHECKLIST);
    res.render(TranslationKeys.CHECK_YOUR_ANSWERS_RULE92, {
      ...translations,
      redirectUrl,
      rule92AnswerDetails: getRule92AnswerDetails(userCase, translations),
    });
  }
}
