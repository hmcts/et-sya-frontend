import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { InterceptPaths, PageUrls, TranslationKeys } from '../definitions/constants';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getFlagValue } from '../modules/featureFlag/launchDarkly';

import { createDownloadLink } from './helpers/DocumentHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { getCancelLink } from './helpers/LinkHelpers';
import { getRespondentCyaContent } from './helpers/RespondentApplicationCYAHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class TribunalResponseCYANotSystemUserController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const welshEnabled = await getFlagValue('welsh-language', null);
    const userCase = req.session?.userCase;

    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.SIDEBAR_CONTACT_US,
      TranslationKeys.TRIBUNAL_RESPONSE_CYA,
    ]);

    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.TRIBUNAL_RESPONSE_CYA, { returnObjects: true }),
      ...req.t(TranslationKeys.TRIBUNAL_RESPOND_TO_ORDER, { returnObjects: true }),
    };

    const downloadLink = createDownloadLink(userCase?.supportingMaterialFile);

    let storedUrl;
    let responseUrl;
    let id;
    if (userCase.selectedRequestOrOrder) {
      storedUrl = InterceptPaths.TRIBUNAL_RESPONSE_STORE_CYA + getLanguageParam(req.url);
      id = userCase.selectedRequestOrOrder.id;
      responseUrl = PageUrls.TRIBUNAL_RESPOND_TO_ORDER.replace(':orderId', id);
    } else if (userCase.selectedGenericTseApplication) {
      userCase.isRespondingToRequestOrOrder = true;
      storedUrl = InterceptPaths.STORE_RESPONDENT_CYA + getLanguageParam(req.url);
      id = userCase.selectedGenericTseApplication.id;
      responseUrl = PageUrls.RESPOND_TO_TRIBUNAL_RESPONSE.replace(':appId', id);
    }

    res.render(TranslationKeys.CONTACT_THE_TRIBUNAL_CYA_NOT_SYSTEM_USER, {
      ...content,
      ...translations,
      cancelPage: getCancelLink(req),
      storedUrl,
      cyaContent: getRespondentCyaContent(
        userCase,
        translations,
        getLanguageParam(req.url),
        PageUrls.RESPONDENT_SUPPORTING_MATERIAL.replace(':appId', id),
        downloadLink,
        responseUrl
      ),
      welshEnabled,
    });
  }
}
