import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { AnyRecord } from '../definitions/util-types';

import { setUserCase } from './helpers/CaseHelpers';
import { getCaptionTextForCopyToOtherParty, getRedirectPageUrlNotSystemUser } from './helpers/CopyToOtherPartyHelper';
import { getCopyToOtherPartyError } from './helpers/ErrorHelpers';
import { getLanguageParam } from './helpers/RouterHelpers';
import { getCancelLink } from './helpers/Rule92NotSystemUserHelper';

export default class CopyToOtherPartyNotSystemUserController {
  public post = async (req: AppRequest, res: Response): Promise<void> => {
    if (req.body.copyToOtherPartyYesOrNo === YesOrNo.YES) {
      req.body.copyToOtherPartyText = undefined;
    }
    setUserCase(req, this.form);
    const languageParam = getLanguageParam(req.url);
    const formData = this.form.getParsedBody(req.body, this.form.getFormFields());
    const copyToOtherPartyError = getCopyToOtherPartyError(formData);
    req.session.errors = [];
    if (copyToOtherPartyError) {
      req.session.errors.push(copyToOtherPartyError);
      return res.redirect(PageUrls.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER + languageParam);
    }
    return res.redirect(getRedirectPageUrlNotSystemUser(req) + languageParam);
  };

  public get = (req: AppRequest, res: Response): void => {
    const translations: AnyRecord = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.SIDEBAR_CONTACT_US, { returnObjects: true }),
      ...req.t(TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER, { returnObjects: true }),
    };

    const captionTranslations: AnyRecord = {
      ...req.t(TranslationKeys.CONTACT_THE_TRIBUNAL, { returnObjects: true }),
      ...req.t(TranslationKeys.COPY_TO_OTHER_PARTY, { returnObjects: true }),
    };

    res.render(TranslationKeys.COPY_TO_OTHER_PARTY_NOT_SYSTEM_USER, {
      ...translations,
      applicationType: getCaptionTextForCopyToOtherParty(req, captionTranslations),
      cancelLink: getCancelLink(req),
    });
  };
}
