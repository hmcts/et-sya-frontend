import express, { NextFunction, Request, RequestHandler, Response } from 'express';
import i18next, { InitOptions, Resource } from 'i18next';
import * as i18nextMiddleware from 'i18next-http-middleware';
import requireDir from 'require-directory';

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
      detection: {
        order: ['querystring', 'cookie'],
        caches: ['cookie'],
        cookieSecure: true,
        httpOnly: true,
      },
    };
    i18next.use(i18nextMiddleware.LanguageDetector).init(options);
  }

  public enableFor(app: express.Express): void {
    app.use(i18nextMiddleware.handle(i18next) as unknown as RequestHandler);
    app.use((req: Request, res: Response, next: NextFunction) => {
      Object.assign(res.locals, req.t('template', { returnObjects: true }));
      next();
    });
  }
}
