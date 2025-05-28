import { Response } from 'express';
import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { getLanguageParam } from '../helpers/RouterHelpers';

export default class AppointLegalRepController {
  public get = async (req: AppRequest, res: Response): Promise<void> => {
    const content = {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPOINT_LEGAL_REPRESENTATIVE_SCREEN, { returnObjects: true }),
    };

    const languageParam = getLanguageParam(req.url);

    res.render(TranslationKeys.APPOINT_LEGAL_REPRESENTATIVE, {
      ...content,
      currentUrl: '/appoint-legal-representative',
      languageParam,
      PageUrls
    });
  };
}
