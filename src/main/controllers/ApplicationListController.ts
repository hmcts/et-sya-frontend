import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { TranslationKeys } from '../definitions/constants';

import { retrieveCurrentLocale } from './helpers/ApplicationTableRecordTranslationHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class ApplicationListController {
  public get(req: AppRequest, res: Response): void {
    const languageParam = getLanguageParam(req.url);
    const redirectUrl = `/citizen-hub/${req.session.userCase?.id}${languageParam}`;

    const applicationDate = new Date();
    const dateString = applicationDate.toLocaleDateString(retrieveCurrentLocale(req?.url), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const row = {
      date: dateString,
      app: 'Pospone a hearing',
      status: 'Updated',
    };

    const rows = [row];

    res.render(TranslationKeys.APPLICATION_LIST, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.APPLICATION_LIST, { returnObjects: true }),
      redirectUrl,
      rows,
    });
  }
}
