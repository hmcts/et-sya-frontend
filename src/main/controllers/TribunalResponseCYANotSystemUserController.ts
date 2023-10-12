import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { ErrorPages, InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { createDownloadLink } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getCancelLink } from './helpers/LinkHelpers';
import { getRespondentCyaContent } from './helpers/RespondentApplicationCYAHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class TribunalResponseCYANotSystemUserController {
  public get(req: AppRequest, res: Response): void {
    const userCase = req.session?.userCase;

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.COMMON,
      TranslationKeys.TRIBUNAL_RESPONSE_CYA,
    ]);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.TRIBUNAL_RESPONSE_CYA, { returnObjects: true }),
    };

    const downloadLink = createDownloadLink(userCase?.supportingMaterialFile);

    let storedUrl;
    let id;
    if (userCase.selectedRequestOrOrder) {
      storedUrl = ErrorPages.NOT_FOUND; // InterceptPaths.TRIBUNAL_RESPONSE_SUBMIT_CYA + getLanguageParam(req.url);
      id = userCase.selectedRequestOrOrder.id;
    } else if (userCase.selectedGenericTseApplication) {
      userCase.isRespondingToRequestOrOrder = true;
      storedUrl = InterceptPaths.STORE_RESPONDENT_CYA + getLanguageParam(req.url);
      id = userCase.selectedGenericTseApplication.id;
    }

    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER, {
      ...content,
      cancelPage: getCancelLink(req),
      storedUrl,
      cyaContent: getRespondentCyaContent(
        userCase,
        translations,
        getLanguageParam(req.url),
        PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', id),
        downloadLink
      ),
    });
  }
}
