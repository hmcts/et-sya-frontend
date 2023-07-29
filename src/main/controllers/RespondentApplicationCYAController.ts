import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { createDownloadLink } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getRespondentCyaContent } from './helpers/RespondentApplicationCYAHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class RespondentApplicationCYAController {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;
    userCase.isRespondingToRequestOrOrder = false;

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.RESPONDENT_APPLICATION_CYA,
    ]);

    const cancelPage = setUrlLanguage(req, PageUrls.CITIZEN_HUB.replace(':caseId', userCase.id));

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.RESPONDENT_APPLICATION_CYA, { returnObjects: true }),
    };

    const downloadLink = createDownloadLink(userCase?.supportingMaterialFile);

    res.render(TranslationKeys.RESPONDENT_APPLICATION_CYA, {
      ...content,
      ...translations,
      PageUrls,
      userCase,
      respondents: req.session.userCase?.respondents,
      InterceptPaths,
      errors: req.session.errors,
      cancelPage,
      submitRef: InterceptPaths.SUBMIT_RESPONDENT_CYA + getLanguageParam(req.url),
      cyaContent: getRespondentCyaContent(
        userCase,
        translations,
        getLanguageParam(req.url),
        PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', userCase.selectedGenericTseApplication.id),
        downloadLink
      ),
    });
  }
}
