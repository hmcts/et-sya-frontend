import { Response } from 'express';

import { AppRequest } from '../../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../../definitions/constants';
import { FormContent } from '../../definitions/form';
import { AnyRecord } from '../../definitions/util-types';
import { getPageContent } from '../helpers/FormHelpers';

export default class GuidanceController {
  public get = (req: AppRequest, res: Response): void => {
    const content: AnyRecord = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.MULTIPLE_GUIDANCE,
    ]);

    const userCase = req.session?.userCase;
    const returnUrl = userCase?.id ? `${PageUrls.CITIZEN_HUB}/${userCase.id}` : PageUrls.CLAIM_STEPS;

    res.render('multiples/guidance', {
      ...content,
      returnUrl,
    });
  };
}
