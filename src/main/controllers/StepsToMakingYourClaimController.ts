import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';

import { getPageContent } from './helpers';

export default class StepsToMakingYourClaimController {
  public get(req: AppRequest, res: Response): void {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM,
    ]);
    res.render(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM, {
      ...content,
    });
  }
}
