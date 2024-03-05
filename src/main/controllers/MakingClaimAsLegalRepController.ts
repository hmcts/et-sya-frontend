import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';

import { getPageContent } from './helpers/FormHelpers';

export default class MakingClaimAsLegalRepController {
  public get = (req: AppRequest, res: Response): void => {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.MAKING_CLAIM_AS_LEGAL_REPRESENTATIVE,
    ]);
    res.render(TranslationKeys.MAKING_CLAIM_AS_LEGAL_REPRESENTATIVE, {
      ...content,
      createLink: '#',
      signInLink: '#',
    });
  };
}
