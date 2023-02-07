import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getCyaContent } from './helpers/ContactTheTribunalCYAHelper';
import { createDownloadLink } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class ContactTheTribunalCYAController {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.CONTACT_THE_TRIBUNAL_CYA,
    ]);

    const cancelPage = setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, { returnObjects: true }),
    };

    const downloadLink = createDownloadLink(userCase?.contactApplicationFile);

    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA, {
      ...content,
      ...translations,
      PageUrls,
      userCase,
      respondents: req.session.userCase?.respondents,
      InterceptPaths,
      errors: req.session.errors,
      cancelPage,
      languageParam: getLanguageParam(req.url),
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
