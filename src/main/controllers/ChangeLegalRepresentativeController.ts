import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';

import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class ChangeLegalRepresentativeController {
  public get(req: AppRequest, res: Response): void {
    const citizenHubUrl = setUrlLanguage(req, TranslationKeys.CITIZEN_HUB + '/' + req.session.userCase.id);
    const contactTheTribunalUrl = setUrlLanguage(req, TranslationKeys.CONTACT_THE_TRIBUNAL + '/other');
    res.render(TranslationKeys.CHANGE_LEGAL_REPRESENTATIVE, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CHANGE_LEGAL_REPRESENTATIVE, { returnObjects: true }),
      PageUrls,
      citizenHubUrl,
      contactTheTribunalUrl,
      languageParam: getLanguageParam(req.url),
    });
  }
}
