import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getCyaContent } from './helpers/BundlesPrepareDocsCYAHelper';
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
      TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA,
    ]);

    const cancelPage = setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }), // maybe should be removed
    };

    const downloadLink = createDownloadLinkForHearingDoc(userCase?.hearingDocument);

    res.render(TranslationKeys.BUNDLES_DOCS_FOR_HEARING_CYA, {
      ...content,
      ...translations,
      showParagraphAboutSubmittingDocsInAdvance: true,
      PageUrls,
      userCase,
      respondents: req.session.userCase?.respondents,
      InterceptPaths,
      errors: req.session.errors,
      cancelPage,
      submitRef: InterceptPaths.BUNDLES_HEARING_DOCS_SUBMIT_CYA + getLanguageParam(req.url),
      cyaContent: getCyaContent(
        userCase,
        translations,
        getLanguageParam(req.url),
        //   PageUrls.TRIBUNAL_CONTACT_SELECTED.replace(':selectedOption', 'userCase.contactApplicationType'),
        downloadLink,
        translations.whoseHearingDocument[userCase.whoseHearingDocumentsAreYouUploading],
        translations.whatAreTheHearingDocuments[userCase.whatAreTheseDocuments]
      ),
    });
  }
}
