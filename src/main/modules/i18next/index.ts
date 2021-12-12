import { NextFunction, Request, Response } from 'express';
import i18next, { InitOptions, Resource } from 'i18next';
import * as i18nextMiddleware from 'i18next-http-middleware';
import requireDir from 'require-directory';
import express from 'express';

const resources = requireDir(module, '../../resources', {
  include: /locales/,
}).locales as Resource;

export class I18Next {
  constructor() {
    const options: InitOptions = {
      preload: ['en', 'cy'],
      resources,
      fallbackLng: 'en',
      supportedLngs: ['en', 'cy'],
      detection: { order: ['querystring', 'cookie'], caches: ['cookie'] },
    };
    i18next.use(i18nextMiddleware.LanguageDetector).init(options);
  }

  public enableFor(app: express.Express): void {
    app.use(i18nextMiddleware.handle(i18next));
    app.use((req: Request, res: Response, next: NextFunction) => {
      Object.assign(res.locals, req.i18n.getDataByLanguage(req.language).translation.template);
      next();
    });
  }
}
