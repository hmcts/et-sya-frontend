import config from 'config';
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

    const signInLink: string = process.env.MANAGE_CASE_URL ?? config.get('services.manageCase.url');
    const createLinkBase: string = process.env.MANAGE_ORG_URL ?? config.get('services.manageOrg.url');
    const createLink: string = createLinkBase + '/register-org-new/register';

    res.render(TranslationKeys.MAKING_CLAIM_AS_LEGAL_REPRESENTATIVE, {
      ...content,
      createLink,
      signInLink,
    });
  };
}
