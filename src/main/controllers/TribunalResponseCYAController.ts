import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { createDownloadLink } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getRespondentCyaContent } from './helpers/RespondentApplicationCYAHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class TribunalResponseCYAController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session?.userCase;

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.TRIBUNAL_RESPONSE_CYA,
    ]);

    const cancelPage = setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.TRIBUNAL_RESPONSE_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER, { returnObjects: true }),
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
    };

    const downloadLink = createDownloadLink(userCase?.supportingMaterialFile);

    let submitRef;
    let id;
    if (userCase.selectedRequestOrOrder) {
      submitRef = InterceptPaths.TRIBUNAL_RESPONSE_SUBMIT_CYA + getLanguageParam(req.url);
      id = userCase.selectedRequestOrOrder.id;
    } else if (userCase.selectedGenericTseApplication) {
      userCase.isRespondingToRequestOrOrder = true;
      submitRef = InterceptPaths.SUBMIT_RESPONDENT_CYA + getLanguageParam(req.url);
      id = userCase.selectedGenericTseApplication.id;
    }

    res.render(TranslationKeys.TRIBUNAL_RESPONSE_CYA, {
      ...content,
      ...translations,
      PageUrls,
      userCase,
      respondents: req.session.userCase?.respondents,
      InterceptPaths,
      errors: req.session.errors,
      cancelPage,
      submitRef,
      cyaContent: getRespondentCyaContent(
        userCase,
        translations,
        getLanguageParam(req.url),
        PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', id),
        downloadLink,
        PageUrls.TRIBUNAL_RESPOND_TO_ORDER.replace(':orderId', id)
      ),
      welshEnabled,
    });
  }
}
