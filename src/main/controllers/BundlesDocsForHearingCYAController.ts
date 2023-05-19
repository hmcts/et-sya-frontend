import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getCyaContent } from './helpers/ContactTheTribunalCYAHelper';
import { createDownloadLinkForHearingDoc } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class BundlesDocsForHearingCYAController {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA, //
    ]);

    const cancelPage = setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA, { returnObjects: true }),
    };

    const downloadLink = createDownloadLinkForHearingDoc(userCase?.hearingDocument);
    console.log('download link is ', downloadLink);
    // okay to here
    // create the nunjucks file

    res.render(TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA, {
      ...content,
      ...translations,
      PageUrls,
      userCase,
      respondents: req.session.userCase?.respondents,
      InterceptPaths,
      errors: req.session.errors,
      cancelPage,
      submitRef: InterceptPaths.SUBMIT_TRIBUNAL_CYA + getLanguageParam(req.url),
      cyaContent: getCyaContent(
        userCase,
        translations,
        getLanguageParam(req.url),
        PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', 'userCase.contactApplicationType'),
        downloadLink,
        'type of application'
        //translations.sections[userCase.contactApplicationType].label
      ),
    });
  }
}
