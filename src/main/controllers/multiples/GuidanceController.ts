import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys, Views } from '../../definitions/constants';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { getPageContent } from '../helpers/FormHelpers';
import { getLanguageParam } from '../helpers/RouterHelpers';

export default class GuidanceController {
  public get = (req: AppRequest, res: Response): void => {
    const content: AnyRecord = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.MULTIPLE_GUIDANCE,
    ]);

    const userCase = req.session?.userCase;
    const languageParam = getLanguageParam(req.url);
    const returnUrl = userCase?.id
      ? `${PageUrls.CITIZEN_HUB}/${userCase.id}${languageParam}`
      : `${PageUrls.CLAIM_STEPS}${languageParam}`;

    res.render(Views.MULTIPLE_GUIDANCE, {
      ...content,
      returnUrl,
    });
  };
}
