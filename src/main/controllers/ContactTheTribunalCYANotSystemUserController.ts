import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getCyaContent } from './helpers/ContactTheTribunalCYAHelper';
import { createDownloadLink } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getCancelLink } from './helpers/Rule92NotSystemUserHelper';

export default class ContactTheTribunalCYANotSystemUserController {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.CONTACT_THE_TRIBUNAL_CYA,
    ]);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, { returnObjects: true }),
    };

    const downloadLink = createDownloadLink(userCase?.contactApplicationFile);

    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER, {
      ...content,
      cancelPage: getCancelLink(req),
      storedUrl: InterceptPaths.STORE_TRIBUNAL_CYA + getLanguageParam(req.url),
      cyaContent: getCyaContent(
        userCase,
        translations,
        getLanguageParam(req.url),
        PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', userCase.contactApplicationType),
        downloadLink,
        translations.sections[userCase.contactApplicationType].label
      ),
    });
  }
}