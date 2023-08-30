import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';

import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getCancelLink } from './helpers/Rule92NotSystemUserHelper';
import { getContactTribunalCyaContent } from './helpers/StoredToSubmitCYAHelper';

export default class StoredToSubmitCYAController {
  public get(req: AppRequest, res: Response): void {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_THE_TRIBUNAL_CYA,
    ]);

    res.render(TranslationKeys.STORED_TO_SUBMIT_CYA, {
      ...content,
      cancelPage: getCancelLink(req),
      submitUrl: InterceptPaths.STORED_TO_SUBMIT_UPDATE + getLanguageParam(req.url),
      cyaContent: getContactTribunalCyaContent(req, getLanguageParam(req.url)),
    });
  }
}
