import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { FEATURE_FLAGS, InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';
import { getCyaContent } from './helpers/BundlesPrepareDocsCYAHelper';
import { createDownloadLinkForHearingDoc } from './helpers/DocumentHelpers';
import { createLabelForHearing, getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class BundlesDocsForHearingCYAController {
  public async get(req: AppRequest, res: Response): Promise<void> {
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
    const foundHearing = userCase.hearingCollection?.find(hearing => hearing.id === userCase.hearingDocumentsAreFor);
    const formattedSelectedHearing = createLabelForHearing(foundHearing);
    const bundlesEnabled = await getFlagValue(FEATURE_FLAGS.BUNDLES, null);

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
      submitRef: InterceptPaths.SUBMIT_BUNDLES_HEARING_DOCS_CYA + getLanguageParam(req.url),
      cyaContent: getCyaContent(
        userCase,
        translations,
        getLanguageParam(req.url),
        downloadLink,
        translations.whoseHearingDocument[userCase.whoseHearingDocumentsAreYouUploading],
        translations.whatAreTheHearingDocuments[userCase.whatAreTheseDocuments],
        formattedSelectedHearing
      ),
      bundlesEnabled,
    });
  }
}
